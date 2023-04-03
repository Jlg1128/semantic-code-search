import { DEFAULT_EMBEDDING_MODEL } from './const';
import search from './searchFunction';
import { loadEnv } from './util';
loadEnv('example');

search('用户名称', {model: DEFAULT_EMBEDDING_MODEL}).then(searchResult => {
  console.log('匹配的内容是', searchResult);
})