import { ParseResult, ParseResultItem } from './parser/parserBase';
// @ts-ignore
import * as pd from 'node-pandas';
import { dataFilePathGetter } from './const';
import { getEmbedding } from './embeddingUtil';
import { csvStringReplace, minifyCode } from './util';

export type CSVDataItem = ParseResultItem & {
  codeEmbedding: string,
  similarity?: number,
}
export type CSVData = CSVDataItem[]

async function generateEmbedings(datas: ParseResult) {
  async function getCodeEmbeddings() {
    for (const data of datas as CSVData) {
      console.log('current process embedding ===> ', data.filePath + '/' + data.functionName);
      const codeEmbedding = await getEmbedding(process.env.MINIFY_CODE == 'true' ? minifyCode(data.code) : data.code);
      data.codeEmbedding = '"[' + codeEmbedding.join(',') + ']"';
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
  console.log('数据写入到 ===> ' + dataPath);
}

export default generateEmbedings;