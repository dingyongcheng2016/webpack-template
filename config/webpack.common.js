const paths = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 引入vconsole
const MobileVconsoleWebpackPlugin = require('mobile-vconsole-webpack-plugin');

module.exports = {
    // babel-loader只会将 ES6/7/8+语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等
    // 对新转换api, 借助babel-polyfill
    // entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],  
    entry: [paths.src + '/index.js'],  
    output: {
        path: paths.build,
        filename: '[name][hash8].js',
        publicPath: '/'
    },
    // Determine how modules within the project are treated
    module: {
        // 优化
        // 不需要解析依赖的第三方大型类库等，可以通过这个字段进行配置，以提高构建速度
        noParse: /jquery|lodash/, 
        rules: [
            // JavaScript: Use Babel to transpile JavaScript files
            {
                test: /\.js$/,
                include: paths.src, // 优化
                exclude: /node_modules/, // 优化
                use: [
                    // {
                    //    loader: 'thread-loader', // 开启多进程打包
                    //    options: {
                    //        worker: 3,  // 优化
                    //     }
                    // },
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true // 启用缓存 优化
                          }
                    }
                    
                ]
            },
            // file-loader 和 url-loader适用于图片、字体等文件
            // {
            //     test: /\.(jpe?g|png|gif)$/i,
            //     use:[
            //       {
            //         loader: 'url-loader',
            //         options: {
            //           name: '[name][hash:8].[ext]',
            //           // 文件小于 50k 会转换为 base64，大于则拷贝文件
            //           limit: 50 * 1024
            //         }
            //       }
            //     ]
            // },

            // webpack5 新增资源模块(asset module)，允许使用资源文件（字体，图标等）而无需配置额外的 loader。
            // asset/resource 将资源分割为单独的文件，并导出 url，类似之前的 file-loader 的功能.
            // asset/inline 将资源导出为 dataUrl 的形式，类似之前的 url-loader 的小于 limit 参数时功能.
            // asset/source 将资源导出为源码（source code）. 类似的 raw-loader 功能.
            // asset 会根据文件大小来选择使用哪种类型，当文件小于 8 KB（默认） 的时候会使用 asset/inline，否则会使用 asset/resource
            // Images: Copy image files to build folder
            { 
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i, 
                type: 'asset/resource',
                generator: {
                    // 输出文件位置以及文件名
                    // [ext] 自带 "." 这个与 url-loader 配置不同
                    filename: "[name][hash:8][ext]"
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 50 * 1024 //超过50kb不转 base64
                    }
                }
            },
            // Fonts and SVGs: Inline files
            { 
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                type: 'asset/inline'
            },
            
    
        ]
    },
    // 优化
    resolve: {
        //告诉 webpack 解析模块时应该搜索的目录, paths.src目录优先于 node_modules/ 搜索
        modules: [paths.src, 'node_modules'],
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '~':  paths.src,
            '@': paths.src,
            assets: paths.public
        },
    },

    //自定义的 Loader 路径配置
    // resolveLoader: {
    //     modules: ['node_modules',resolve('loader')] 
    // },

    //从输出的 bundle 中排除依赖
    // externals: {
    //     jquery: 'jQuery',
    // },

    // Customize the webpack build process
    plugins: [
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),
        // Copies files from target to destination folder
        new CopyWebpackPlugin({
            patterns: [
                {
                  from: paths.public,
                  to: 'assets',
                  globOptions: {
                    ignore: ['*.DS_Store'],
                  },
                  noErrorOnMissing: true,
                },
            ],
        }),
        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
        new HtmlWebpackPlugin({
            title: '',
            favicon: paths.public + '/favicon.ico',
            template: paths.public + '/index.html',
            filename: 'index.html',
        }),
        new MobileVconsoleWebpackPlugin({
            enable: process.env.NODE_ENV != 'production' ? true : false
        })
    ]

}