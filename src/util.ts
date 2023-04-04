import * as fs from 'fs';
import * as path from 'path';
import { Parser } from './parser/parserBase';
import * as dotenv from 'dotenv';
import { DOUBLE_QUOTES_PLACEHOLDER, ROOT_PATH, envFilePathGetter } from './const';
//@ts-ignore
import * as minify from 'babel-minify';
import * as csv from 'csv-parser';
// @ts-ignore
import * as pd from './node-pandas/src';
import { CSVData } from './types';

interface ArgsMap {
  [key: string]: string
}
let parseInfo: ArgsMap | undefined = undefined;

function loadEnv(target?: string) {
  if (!target) {
    target = getParseArgs().target || process.env.DEFAULT_TARGET;
  }
  const envFile = envFilePathGetter(target);
  dotenv.config({path: envFile, override: true});
  console.log(`current using ===> ${envFile} as env file`)
}


function getParseArgs(): ArgsMap{
  if (parseInfo) return parseInfo
  parseInfo = {};
  
  const args: string[] = process.argv.filter(arg => arg.includes('='));
  args.forEach(arg => {
    const [name, value] = arg.split('=');
    parseInfo[name] = value;
  })
  
  return parseInfo;
}

function getParserName() {
  return process.env.PARSER;
}

function getParseRepoPath() {
  return process.env.REPOPATH || (ROOT_PATH + '/example-repo');
}

function getParseRepoName() {
  return path.basename(getParseRepoPath());
}

function getArrayFromArrayString(arrayString: string) {
  if (!arrayString) arrayString = ''
  // arrayString = arrayString.replace(/[[\]]/g, '');
  const evalRes = eval(arrayString);
  if (Array.isArray(evalRes)) {
    return evalRes;
  }
  return []
}

function getParseExt(): string[] {
  const arrayString = process.env.EXT;
  const ext = getArrayFromArrayString(arrayString);
  return ext;
}

function getExcludeDirs(): string[] {
  const arrayString = process.env.EXCLUDE_DIRS;
  const repoPath = getParseRepoPath();
  const excludeDirs = getArrayFromArrayString(arrayString).map(dir => repoPath + '/' + dir);
  return excludeDirs;
}

function traverseDirAndParse(parser: Parser, repoPath: string, options: {excludeDirs: string[], ext: string[]}) {
  const {excludeDirs = [], ext = []} = options;
  let tempFilePath = repoPath;
  const temp = [repoPath];
  const parseResult = [];
  
  while (temp.length) {
    tempFilePath = temp.pop();
    const fileStat = fs.statSync(tempFilePath);
    if (fileStat.isFile()) {
      if (ext.length && !ext.includes(path.extname(tempFilePath)) && !excludeDirs.includes(tempFilePath)) {
        continue;
      }
      const fileStr = fs.readFileSync(tempFilePath, 'utf-8');
      const relativePath = tempFilePath.replace(getParseRepoPath(), '').replace(/^\//, '');
      console.log('current parsing ===> ', relativePath, '\n');
      try {
        const res = parser(fileStr, relativePath);
        if (res && res.length) {
          res.forEach(item => item.filePath = relativePath);
          parseResult.push(...res)
        } 
      } catch (error) {
        console.log('parse error', error);
      }
    }
    else {
      const dirNames = fs.readdirSync(tempFilePath);
      const ignoreDirNames = ['node_modules'];
      for (const dirname of dirNames) {
        const currentPath = tempFilePath + '/' + dirname;
        if ((!excludeDirs || !excludeDirs.includes(currentPath)) && !ignoreDirNames.includes(dirname)) {
          temp.push(tempFilePath + '/' + dirname);
        }
      }
    }
  }
  return parseResult;
}

function minifyCode(code: string) {
  return minify(code.replace(/[\r\n]/g, ''), {mangle: {
    keepClassName: true,
  }}).code;
}

function csvStringReplace(str: string, type: 'set' | 'get' = 'set'): string {
  if (!/[,\n"]/.test(str) || typeof str !== 'string') {
    return str;
  }
  if (type === 'set') {
    return '"' + str.replace(/"/g, DOUBLE_QUOTES_PLACEHOLDER) + '"';
  }
  return str.replace(new RegExp(DOUBLE_QUOTES_PLACEHOLDER, 'g'), '"');
}

type Cache = {
  [key: string]: any,
}
const cache: Cache = {}

export function getCSVSource(dataFilePath: string): Promise<CSVData> {
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


export {
  getParseArgs,
  getParserName,
  getParseRepoName,
  getParseRepoPath,
  getExcludeDirs,
  getParseExt,
  traverseDirAndParse,
  loadEnv,
  minifyCode,
  csvStringReplace,
}