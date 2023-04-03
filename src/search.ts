import { DEFAULT_EMBEDDING_MODEL } from './const';
import { loadEnv } from './util';
loadEnv('example');
import search from './searchFunction';

search('用户名称', {model: DEFAULT_EMBEDDING_MODEL}).then(searchResult => {
  console.log('匹配的内容是', searchResult);
})