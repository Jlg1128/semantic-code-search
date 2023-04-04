import { ParseResultItem } from './parser/parserBase'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ErrorMessage {
  code: string
  message: string
}

export type CSVDataItem = ParseResultItem & {
  codeEmbedding: string,
  similarity?: number,
}

export type CSVData = CSVDataItem[]