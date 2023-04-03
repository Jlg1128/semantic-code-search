import { ParseResult, ParseResultItem } from './parser/parserBase';
// @ts-ignore
import * as pd from './node-pandas/src';
import { DEFAULT_BATCH_COUNT, DEFAULT_EMBEDDING_MODEL, dataFilePathGetter } from './const';
import { getEmbedding } from './openAIUtil';
import { csvStringReplace } from './util';
import { CreateEmbeddingResponseDataInner } from 'openai';

export type CSVDataItem = ParseResultItem & {
  codeEmbedding: string,
  similarity?: number,
}
export type CSVData = CSVDataItem[]

function batchGenerate(batchDatas: CSVData, embeddingResponseData: CreateEmbeddingResponseDataInner[]) {
  batchDatas.forEach((batchDataItem, index) => {
    const embeddingbObj = embeddingResponseData[index];
    if (embeddingbObj && embeddingbObj.embedding && Array.isArray(embeddingbObj.embedding)) {
      batchDataItem.codeEmbedding = '[' + embeddingbObj.embedding.join(',') + ']';
    }
  })
}
async function generateEmbedings(datas: ParseResult, model = DEFAULT_EMBEDDING_MODEL) {
  async function getCodeEmbeddings() {
    let start = 0;
    let i = 0;
    const batchCount = process.env.BATCH_GEN_COUNT ? Number(process.env.BATCH_GEN_COUNT) : DEFAULT_BATCH_COUNT;
    for (const data of datas) {
      if (i % batchCount === 0) {
        const batchDatas = datas.slice(start, start + batchCount) as CSVData;
        if (!batchDatas.length) break;
        console.log('current processing embedding ===> ', `(${batchDatas.map(item => item.filePath + '/' + item.functionName).join('  ')})\n`);
        const batchCodes = batchDatas.map(item => item.code)
        start += batchCount;
        const embeddingResponseData = await getEmbedding(batchCodes, model);
        if (embeddingResponseData) {
          batchGenerate(batchDatas, embeddingResponseData);
        } else {
          // batchCount / 2 and request again
          const first = Math.ceil(batchCount / 2), sencond = batchCount - first;
          let retryBegin = 0;
          for (const count of [first, sencond]) {
            if (count > 0) {
              const embeddingResponseData = await getEmbedding(batchCodes.slice(retryBegin, retryBegin + count), model);
              retryBegin += count;
              if (embeddingResponseData) {
                batchGenerate(batchDatas, embeddingResponseData);
              }
            }
          }
        }
      }
      i++;
    }
  }
  await getCodeEmbeddings();

  datas.forEach(async (item) => {
    Object.entries(item).forEach(([key, value]) => {
      item[key as keyof ParseResultItem] = csvStringReplace(value);
    })
  });
  const df = pd.DataFrame(datas);
  const dataPath = dataFilePathGetter();
  df.toCsv(dataPath);
  console.log('data has been generated at ===> ' + dataPath);
}

export default generateEmbedings;