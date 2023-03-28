import * as path from 'path';
import { getParseRepoName, getParserName } from './util';

export enum COMMAND_ARG_TYPES {
  parser="--parser",
  repoPath="--repoPath",
  excludeDirs='--excludeDirs',
  ext="--ext"
}

export const ROOT_PATH = path.resolve(__dirname, '../');
export const PARSER_PATH = ROOT_PATH + '/src/parser';
export const DATA_PATH = ROOT_PATH + '/data';
export const dataFileNameGetter = () => `${getParseRepoName()}-${getParserName()}.csv`;
export const dataFilePathGetter = () => DATA_PATH + `/${getParseRepoName()}-${getParserName()}.csv`;
export const DOUBLE_QUOTES_PLACEHOLDER = '@@';