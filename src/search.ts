import * as csv from 'csv-parser';
import * as fs from 'fs';
// @ts-ignore
import * as similarity from 'compute-cosine-similarity';
// @ts-ignore
import * as pd from 'node-pandas';
import { CSVData, CSVDataItem } from './generateEmbeddings';
import { csvStringReplace, loadEnv } from './util';
loadEnv();
import { dataFilePathGetter } from './const';
import { getEmbedding } from './embeddingUtil';

const results: CSVData = [];
 
async function search(codeQuery: string, n = 3) { 
  const queryEmbedding = await getEmbedding(codeQuery);
  const dataFilePath = dataFilePathGetter();
  return new Promise((resolve, reject) => {
    fs.createReadStream(dataFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const df:CSVData = pd.DataFrame(results);
      df.forEach((dfItem: CSVDataItem, index) => {
        const embeddingItem = eval(dfItem.codeEmbedding);
        dfItem['similarity'] = similarity(embeddingItem, queryEmbedding);
      })
      const searchResult = [...df.sort((a, b) => b.similarity - a.similarity)].slice(0, n).map(item => {
        Object.entries(item).forEach(([key, value]) => {
            // @ts-ignore
            item[key] = csvStringReplace(value, 'get');
        })
        return {filePath: item.filePath, functionName: item.functionName, code: item.code, score: item.similarity};
      });
      resolve(searchResult);
    }).on('error', reject);
  })
}

search('用户名称').then(searchResult => {
  console.log('匹配的内容是', searchResult);
})