import { getExcludeDirs, getParseExt, getParseRepoPath, getParserName, loadEnv, traverseDirAndParse } from './util';
loadEnv();
import * as fs from 'fs';
import { PARSER_PATH } from './const';
import { Parser } from './parser/parserBase';
import generateEmbedings from './generateEmbeddings';


async function getParserInfo(): Promise<{parser: Parser, repoPath: string, parserPath: string, excludeDirs: string[], ext: string[]}> {
  const parserPath = PARSER_PATH + `/${getParserName()}`;
  const repoPath = getParseRepoPath();
  
  if (!fs.existsSync(parserPath)) {
    throw new Error('parser file not exist');
  }
  const parser = (await import(parserPath)).default as Parser;
  if (!parser) {
    throw new Error('parser function not exist');
  }
  if (!fs.existsSync(repoPath)) {
    throw new Error('repo to be parsed not exist');
  }
  return {
    parser,
    repoPath,
    parserPath,
    excludeDirs: getExcludeDirs(),
    ext: getParseExt(),
  };
}

async function main() {
  const {parser, repoPath, excludeDirs, ext} = await getParserInfo();
  const parseResult = traverseDirAndParse(parser, repoPath, {excludeDirs, ext})

  if (parseResult.length) {
    generateEmbedings(parseResult);
  }
}

main();