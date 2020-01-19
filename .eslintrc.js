module.export = {
  "parser": "babel-eslint", // 解析器
  "extends": [
    "airbnb",
  ], // 继承
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  "rules": {
      "indent": ["error", 2]
  },
  "parserOptions": { 
    "ecmaVersion": 2017
  } 
}