import * as path from 'path';
import { getParseRepoName, getParserName } from './util';

export enum COMMAND_ARG_TYPES {
  parser="--parser",
  repoPath="--repoPath",
  excludeDirs='--excludeDirs',
  ext="--ext"
}

export type EnvMap = {
  OPENAI_API_KEY: string,
  PARSER: string,
  REPOPATH?: string,
  BASE_URL?: string,
  EXCLUDE_DIRS?: string,
  EXT?: string,
  BATCH_GEN_COUNT: string,
}

export const ROOT_PATH = path.resolve(__dirname, '../');
export const PARSER_PATH = ROOT_PATH + '/src/parser';
export const DATA_PATH = ROOT_PATH + '/data';
export const DEFAULT_BATCH_COUNT = 12;
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-ada-002';
export const DEFAULT_CHAT_COMPLETION_MODEL = 'gpt-3.5-turbo';
export const dataFileNameGetter = () => `${getParseRepoName()}-${getParserName()}.csv`;
export const dataFilePathGetter = () => DATA_PATH + `/${getParseRepoName()}-${getParserName()}.csv`;
export const DOUBLE_QUOTES_PLACEHOLDER = '@@';
export const envFilePathGetter = (target: string) => ROOT_PATH + `/.${target}.env`;

export const serverPort = (function() {
  const portIndex = process.argv.indexOf('--port') + 1;
  return portIndex ? process.argv[portIndex] : 3060 
})()