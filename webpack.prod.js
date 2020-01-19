'use strict';

const path = require('path');
const glob = require('glob');



// 提取css 文件的插件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
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
        // chunks: [pageName],
        chunks: ['commons', pageName],
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
  mode: 'production',
  // mode: 'none',

  // entry: {
  //   index: './src/index.js',
  //   search: './src/search.js'
  // },

  entry: entry,

  output: {
    // 所有打包的js合并
    // filename: '[name].js',
    filename: '[name]_[chunkhash:8].js',
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
        // use: ['style-loader', 'css-loader']
        // use: ExtractTextPlugin.extract({
        //   use: ['css-loader']
        // }),
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        // use: [
        //   'style-loader', 
        //   'css-loader', 
        //   'less-loader'
        // ]
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({ overrideBrowserslist: ['> 0.15% in CN'] })
              ]
            }
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 相对px转换的单位
              remPrecision: 8 // 转成自适应rem的位数
            }
          }
        ]
        // use: [
        //   'style-loader',,
        //   'css-loader', 
        //   'less-loader',
        //   {
        //     loader: 'postcss-loader',
        //     options: {
        //       plugins: () => {
        //         require('autoprefixer')({
        //           browaers: ["last 2 version", ">1%", "iOS 7"]
        //         })
        //       }
        //     }
        //   }
        // ]
      },
      // {
      //   test: /\.scss$/,
      //   use: [
      //     {
      //       loader: 'style-loader',
      //       options: {
      //         insertAt: 'top', // 样式插入到<head>
      //         singleton: true, // 将所有的style标签合并成一个
      //       },
      //     },
      //     "css-loader",
      //     "sass-loader",
      //   ],
      // },
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ]
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
    // new ExtractTextPlugin({
    //   filename: `[name]_[hash:8].css`
    // }),


    new MiniCssExtractPlugin({
      filename: `[name]_[contenthash:8].css`
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),

    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),

    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/search.html'),
    //   filename: 'search.html',
    //   chunks: ['search'],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false,
    //   }
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src/index.html'),
    //   filename: 'index.html',
    //   chunks: ['index'],
    //   inject: true,
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false,
    //   }
    // }),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin()
  ].concat(htmlWebpackPlugin),
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /(react|react-dom)/,
  //         name: "vendors",
  //         chunks: "all"
  //       }
  //     }
  //   }
  // },

  // optimization: {
  //   splitChunks: {
  //     minSize: 0, // 文件多大进行打包
  //     cacheGroups: {
  //       commons: {
  //         name: "commons",
  //         chunks: "all",
  //         minChunks: 2, // 应用超过几次进行打包
  //       }
  //     }
  //   }
  // },

  devtool: 'eval'


}