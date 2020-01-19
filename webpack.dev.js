'use strict';

const path = require('path');
const webpack = require('webpack')
const glob = require('glob');


// 提取css 文件的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');


const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugin = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));
  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index]
    
    const match = entryFile.match(/src\/(.*)\/index\.js/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;

    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        }
      })
    )
    
  })

  return {
    entry,
    htmlWebpackPlugin
  }
}

const { entry, htmlWebpackPlugin } = setMPA()

module.exports = {
  mode: 'development',

  // entry: {
  //   index: './src/index.js',
  //   search: './src/search.js'
  // },
  entry: entry,

  output: {
    // 所有打包的js合并
    // filename: '[name].js',
    filename: '[name].js',
    // 输出文件位置
    path: path.join(__dirname, 'dist'),
    // publicPath: '/',
  },

  // loader
  // 处理解析
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
        // use: ExtractTextPlugin.extract({
        //   use: ['css-loader']
        // }),
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', 
          'css-loader', 
          'less-loader',
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        // use: [
        //   'file-loader'
        // ]
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
        // use: [{
        //   loader: 'url-loader',
        //   options: {
        //     name: 'img/[name][hash:8].[ext]',
        //     limit: 10240
        //   }
        // }]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },

  // 
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(),
    // new ExtractTextPlugin({
    //   filename: `[name]_[hash:8].css`
    // }),
    // new htmlWebpackPlugin({
    //   template: './dist/index.html'
    // })
    // new MiniCssExtractPlugin({
    //   filename: `[name][contenthash:8].css`
    // });
  ].concat(htmlWebpackPlugin),
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only'
  },
  devtool: 'source-map'

  // // 默认false 也就是不开启
  // watch: true,
  // // 只有开启监听模式时，watchOptions才有意义
  // watchOptions: {
  //   // 默认未空，不监听的文件或者文件夹，支持正则匹配
  //   ignored: /node_modules/,
  //   // 监听到变化发生后会等300ms再去执行， 默认300ms
  //   aggergateTimeout: 300,
  //   // 判断文件是否发生变化是通过不断询问系统指定文件有没有变化实现的，默认每秒问1000次
  //   poll: 1000
  // }


}