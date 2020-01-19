// const express = require('express');
// const webpack = require('webpack');
// const webpackDevmiddle = require('webpack-dev-middleware');

// const app = express();
// const config = require('./webpack.config');
// const compliler = webpack(config);

// app.use(webpackDevmiddle(compliler, {
//   publicPath: config.output.publicPath
// }));

// app.listen(12306, () => {
//   console.log('listening on port 12306\n')
// })
const path = require('path');

console.log(path.join(__dirname, 'src/index.html'))