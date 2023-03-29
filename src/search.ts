import search from './searchFunction';
import { loadEnv } from './util';
loadEnv();

search('用户名称').then(searchResult => {
  console.log('匹配的内容是', searchResult);
})