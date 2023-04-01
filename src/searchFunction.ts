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

type Cache = {
  [key: string]: any,
}

const cache: Cache = {}

export default async function search(codeQuery: string, n = 3, lines?: number | undefined) { 
  const dataFilePath = dataFilePathGetter();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(dataFilePath)) {
      return reject(new Error('embedding file not exists'));
    }
    const queryEmbedding = await getEmbedding([codeQuery]);
    getCSVSource(dataFilePath).then(df => {
      df.forEach((dfItem: CSVDataItem) => {
        const embeddingItem = eval(dfItem.codeEmbedding);
        if (embeddingItem) {
          dfItem['similarity'] = similarity(embeddingItem, queryEmbedding[0].embedding);
        }
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
    }).catch(err => {
      console.log(`read CSV ${dataFilePath} error`, err);
      reject(err);
    });
  })
}

function getCSVSource(dataFilePath: string): Promise<CSVData> {
  return new Promise((resolve, reject) => {
    if (cache[dataFilePath]) {
      resolve(cache[dataFilePath])
    } else {
      const results: CSVData = []
      fs.createReadStream(dataFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(cache[dataFilePath] = pd.DataFrame(results));
      }).on('error', (err) => {
        delete cache[dataFilePath];
        reject(err);
      });
    }
  })
}