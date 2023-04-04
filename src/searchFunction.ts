import * as fs from 'fs';
// @ts-ignore
import * as similarity from 'compute-cosine-similarity';
// @ts-ignore
import { csvStringReplace, getCSVSource } from './util';
import { dataFilePathGetter } from './const';
import { getEmbedding } from './openAIUtil';
import { CSVDataItem } from './types';

type SearchOptions = {
  model?: string,
  n?: number,
  lines?: number | undefined,
}

type SearchItem = {
  filePath: string,
  functionName: string,
  code: string,
  score: number,
}
type SearchResult = SearchItem[];

export default async function search(codeQuery: string, options: SearchOptions): Promise<SearchResult | undefined> { 
  const {n = 3, model = 'text-embedding-ada-002', lines} = options;
  const dataFilePath = dataFilePathGetter();
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(dataFilePath)) {
      return reject(new Error('embedding file not exists'));
    }
    const queryEmbedding = await getEmbedding([codeQuery], model);
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
