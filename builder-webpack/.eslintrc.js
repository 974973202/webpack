module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "linebreak-style": [0 ,"error", "windows"]
  }
};

// // .eslintrc.js
// module.exports = {
//   // 指定解析器
//   'parse': '',
//   // 指定解析器选项
//   'parserOptions': {},
//   // 指定脚本的运行环境
//   'env': {},
//   // 别人可以直接使用你配置好的ESLint
//   'root': true,
//   // 脚本在执行期间访问的额外的全局变量
//   'globals': {},
//   // 启用的规则及其各自的错误级别
//   'rules': {}
// };