import * as express from 'express';
import { Request } from "express";
import searchFunction from '../searchFunction';
import { loadEnv } from '../util';
import { EnvMap, envFilePathGetter, serverPort } from '../const';
import {parse} from 'dotenv';
import * as fs from 'fs';

const app = express();
type SearchParams = {
  keyword: string,
  model?: string,
  target: string,  // target env file, if target is 'example', will load .example.env
  n?: number, // top n results
  lines?: number, // code lines
}

type EnvInfoParams = {
  target: string;
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

app.get('/envInfo', (req: Request, res) => {
  const {target = process.env.DEFAULT_TARGET} = req.query as unknown as EnvInfoParams;
  let envMap: EnvMap;
  if (target) {
    const envFilePath = envFilePathGetter(target);
    if (fs.existsSync(envFilePath)) {
      const file = fs.readFileSync(envFilePath);
      envMap = parse<EnvMap>(file);
      delete envMap.OPENAI_API_KEY;
    }
  }
  res.json({code: 200, result: envMap});
});

app.listen(serverPort, () => {
  console.log(`code-search server listening on port ${serverPort}`)
})

