import * as express from 'express';
import { Request } from "express";
import * as bodyParser from 'body-parser';
import { getCSVSource, loadEnv } from '../util';
loadEnv();
import searchFunction from '../searchFunction';
import { DEFAULT_CHAT_COMPLETION_MODEL, EnvMap, dataFilePathGetter, envFilePathGetter, serverPort } from '../const';
import {parse} from 'dotenv';
import * as fs from 'fs';
import { chat, completion, parseOpenAIStream } from '../openAIUtil';
import { errorResponse } from './util';
import * as path from 'path';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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

type CompletionParams = {
  prompt: string;
  model?: string;
}

let prevTarget: string = process.env.DEFAULT_TARGET;

app.get('/search', async (req: Request, res) => {
  const {keyword, model, target = process.env.DEFAULT_TARGET, n = 3, lines} = req.query as unknown as SearchParams;
  if (!target) {
    return errorResponse(res, 401, new Error('target not specified'));
  }
  console.log('search target:', target);
  if (prevTarget !== target) {
    loadEnv(target);
    prevTarget = target;
  }
  try {
    const searchResult = await searchFunction(keyword, {n, lines, model});
    if (searchResult && process.env.RELATIVE_ROOT_URL) {
      searchResult.forEach((searchItem) => {
        searchItem.filePath = path.join(process.env.RELATIVE_ROOT_URL, searchItem.filePath);
      })
    }
    res.json({code: 200, result: searchResult, err: null});
  } catch (error) {
    return errorResponse(res, 401, error);
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

app.get('/chat', async (req: Request, res) => {
  const {prompt, model = process.env.CHAT_COMPLETION_MODEL || DEFAULT_CHAT_COMPLETION_MODEL} = req.query as unknown as CompletionParams;
  res.setHeader("Content-type", "application/octet-stream");
  try {
    const chatResponse = await chat([{role: 'user', content: prompt}], model);
    await parseOpenAIStream(chatResponse, (token) => res.write(token));
    res.end();
  } catch (error) {
    console.log('error', error);
    return errorResponse(res, 401, error)
  }
});


// app.get('/completion', (req: Request, res) => {
//   const {prompt, model = DEFAULT_CHAT_COMPLETION_MODEL} = req.query as unknown as CompletionParams;
//    completion(prompt, process.env.CHAT_COMPLETION_MODEL || DEFAULT_CHAT_COMPLETION_MODEL);
//    return res.json({code: 200})
// });

function preload() {
  const dataFilePath = dataFilePathGetter();
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dataFilePath)) {
      console.log('resource preload...');
      getCSVSource(dataFilePath)
      .then(() => resolve(true))
      .catch((error) => reject(error));
    } else {
      resolve(true);
    }
  })
}

function startApp() {
  app.listen(serverPort, () => {
    console.log(`server listening on port ${serverPort}`)
  })
}

function main() {
  preload().then(() => {
    startApp();
  }).catch(err => {
    console.log('resource preload failed:', err?.message);
    startApp();
  })
}

main();
