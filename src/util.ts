import * as fs from 'fs';
import * as path from 'path';
import { Parser } from './parser/parserBase';
import * as dotenv from 'dotenv';
import { DOUBLE_QUOTES_PLACEHOLDER, ROOT_PATH } from './const';
//@ts-ignore
import * as minify from 'babel-minify';

interface ArgsMap {
  [key: string]: string
}
let parseInfo: ArgsMap | undefined = undefined;

function loadEnv() {
  const parseTarget = getParseArgs().parseTarget || 'example';
  dotenv.config({path: ROOT_PATH + `/.${parseTarget}.env`})
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
  return (process.env.REPOPATH || ROOT_PATH)+ '/example-repo';
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
  const excludeDirs = getArrayFromArrayString(arrayString);
  return excludeDirs;
}

function traverseDirAndParse(parser: Parser, repoPath: string, options: {excludeDirNames: string[], ext: string[]}) {
  const {excludeDirNames = [], ext = []} = options;
  let tempFilePath = repoPath;
  const temp = [repoPath];
  const parseResult = [];
  
  while (temp.length) {
    tempFilePath = temp.pop();
    const fileStat = fs.statSync(tempFilePath);
    if (fileStat.isFile()) {
      if (ext.length && !ext.includes(path.extname(tempFilePath))) {
        continue;
      }
      const fileStr = fs.readFileSync(tempFilePath, 'utf-8');
      const relativePath = tempFilePath.replace(getParseRepoPath(), '').replace(/^\//, '');
      const res = parser(fileStr, relativePath);
      console.log('current parsing ===> ', relativePath, '\n');
      res.forEach(item => item.filePath = relativePath);
      if (res.length) {
        parseResult.push(...res)
      }
    }
    else {
      const dirNames = fs.readdirSync(tempFilePath);
      for (const dirname of dirNames) {
        if (!excludeDirNames || !excludeDirNames.includes(dirname)) {
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
  if (!/\n/.test(str) || typeof str !== 'string') {
    return str;
  }
  if (type === 'set') {
    return '"' + str.replace(/"/g, DOUBLE_QUOTES_PLACEHOLDER) + '"';
  }
  return str.replace(new RegExp(DOUBLE_QUOTES_PLACEHOLDER, 'g'), '"');
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