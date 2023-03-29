import * as csv from 'csv-parser';
import * as fs from 'fs';
// @ts-ignore
import * as similarity from 'compute-cosine-similarity';
// @ts-ignore
import * as pd from './node-pandas/src';
import { CSVData, CSVDataItem } from './generateEmbeddings';
import { csvStringReplace } from './util';
import { dataFilePathGetter } from './const';
import { getEmbedding } from './embeddingUtil';

export default async function search(codeQuery: string, n = 3, lines: number | undefined) { 
  const results: CSVData = [];
  const dataFilePath = dataFilePathGetter();
  if (!fs.existsSync(dataFilePath)) {
    return Promise.reject('embedding file not exists');
  }

  const queryEmbedding = await getEmbedding(codeQuery);
  return new Promise((resolve, reject) => {
    fs.createReadStream(dataFilePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      let df:CSVData = null;
      try {
        df = pd.DataFrame(results);
      } catch (error) { /* empty */ }

      df.forEach((dfItem: CSVDataItem, index) => {
        const embeddingItem = eval(dfItem.codeEmbedding);
        dfItem['similarity'] = similarity(embeddingItem, queryEmbedding);
      })
      const searchResult = [...df.sort((a, b) => b.similarity - a.similarity)].slice(0, n).map(item => {
        Object.entries(item).forEach(([key, value]) => {
            // @ts-ignore
            item[key] = csvStringReplace(value, 'get');
        })
        return {
          filePath: item.filePath,
          functionName: item.functionName,
          code: lines ? item.code.split('\n').slice(0, lines).join('\n') : item.code,
          score: item.similarity
        };
      });
      resolve(searchResult);
    }).on('error', reject);
  })
}