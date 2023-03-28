export type Parser = (fileContent: string, filePath: string) => ParseResult;
export type ParseResultItem = {
  code: string,
  filePath: string,
  functionName: string,
  comment?: string,  
  functionBody?: string,
}
export type ParseResult = ParseResultItem[];