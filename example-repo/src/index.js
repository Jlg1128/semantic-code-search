module.exports = Regular.extend({
  // 12312
  config: function({name}) {
    data.deployType = window.deployType;
  },
});
module.exports = Regular.extend({
  config(data) {
    data.deployType = window.deployType;
  },
});

/**
 * 热更新替换
 * 1. custom/hotAssets/version.conf version.conf 进行比较
 * 2. 如果是新的则进行替换
 * 3. cp -Rf custom/hotAssets/static/* src/app/public
 * 4. cp -Rf custom/hotAssets/views/* src/webapp/views
 * 5. 替换config.appConfig.commit
 */
const a = () => {
  console.log('123123')
}

const test2 = function() {
  console.log('test2')
}
/**
 * 热更新替换
 * 1. custom/hotAssets/version.conf version.conf 进行比较
 * 2. 如果是新的则进行替换
 * 3. cp -Rf custom/hotAssets/static/* src/app/public
 * 4. cp -Rf custom/hotAssets/views/* src/webapp/views
 * 5. 替换config.appConfig.commit
 */
function test() {
  return '我是test'
}



class Person {
  constructor() {

  }

  /**
   * getName comment
   */
  getName() {
    123123
  }

  /**
   * getAge comment
   */
  getAge() {

  }
}