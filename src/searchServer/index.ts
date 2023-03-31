import * as express from 'express';
import { Request } from "express";
import searchFunction from '../searchFunction';
import { loadEnv } from '../util';
import { serverPort } from '../const';

const app = express();
type SearchParams = {
  keyword: string,
  model?: string,
  target: string,  // target env file, if target is 'example', will load .example.env
  n?: number, // top n results
  lines?: number, // code lines
}

let prevTarget: string;
app.get('/', async (req: Request, res) => {
  const {keyword, model = 'text-embedding-ada-002', target = process.env.DEFAULT_TARGET, n = 3, lines} = req.query as unknown as SearchParams;
  if (!target) {
    return res.json({code: 401, result: null, err: new Error('target not specified'), message: 'target not specified'})
  }
  if (prevTarget !== target) {
    loadEnv(target);
    prevTarget = target;
  }
  try {
    const searchResult = await searchFunction(keyword, n, lines);
    res.json({code: 200, result: searchResult, err: null});
  } catch (error) {
    res.json({code: 401, result: null, err: error, message: error?.message});
  }
})

app.listen(serverPort, () => {
  console.log(`code-search server listening on port ${serverPort}`)
})

