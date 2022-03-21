const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离样式到一个文件内
// cssnano是基于postcss的一款功能强大的插件包，它集成了近30个插件，
// 只需要执行一个命令，就可以对我们的css做多方面不同类型的优化，比如：
// 删除空格和最后一个分号,删除注释,优化字体权重,丢弃重复的样式规则,优化calc(), 压缩选择器, 减少手写属性, 合并规则
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 这个插件使用 cssnano 优化和压缩 CSS， optimize-css-assets-webpack-plugin 在webpack5中已不在友好支持
// 费时分析
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
// 观的看到打包结果中，文件的体积大小、各模块依赖关系、文件是够重复等问题，极大的方便我们在进行项目优化的时候，进行问题诊断
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// 压缩js
const TerserPlugin = require('terser-webpack-plugin');

const paths = require('./paths');

const config = merge(common, {
    mode: 'production',
    //本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快
    // 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
    // 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 module
    devtool: false,
    output: {
      path: paths.build,
      publicPath: '/',
      // Webpack 文件指纹策略是将文件名后面加上 hash 值。特别在使用 CDN 的时候，缓存是它的特点与优势
      // ext 文件后缀名, name 文件名, path 文件相对路径, folder 文件所在文件夹, hash 每次构建生成的唯一 hash 值,
      // chunkhash 根据 chunk 生成 hash 值, contenthash 根据文件内容生成hash 值
      filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
        rules: [
          // Styles: Inject CSS into the head with source maps
          {
            test: /\.s(a|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader, // 添加loader
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  sourceMap: false,
                  modules: false,
                },
              },
              'postcss-loader',
              'sass-loader',
            ],
          },
        ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css',
        chunkFilename: '[id].css',
      }),

      // new BundleAnalyzerPlugin({
      //   // analyzerMode: 'disabled',  // 不启动展示打包报告的http服务器
      //   // generateStatsFile: true, // 是否生成stats.json文件
      // }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(), 
          new TerserPlugin({}),
          '...', // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
        ],
        runtimeChunk: {
          name: 'runtime'
        },
        splitChunks: {
          chunks: 'async', // 有效值为 `all`，`async` 和 `initial`
          minSize: 20000, // 生成 chunk 的最小体积（≈ 20kb)
          minRemainingSize: 0, // 确保拆分后剩余的最小 chunk 体积超过限制来避免大小为零的模块
          minChunks: 1, // 拆分前必须共享模块的最小 chunks 数。
          maxAsyncRequests: 30, // 最大的按需(异步)加载次数
          maxInitialRequests: 30, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          enforceSizeThreshold: 50000,
          cacheGroups: { // 配置提取模块的方案
            // defaultVendors: {
            //   test: /[\/]node_modules[\/]/,
            //   priority: -10,
            //   reuseExistingChunk: true,
            // },
            // default: {
            //   minChunks: 2,
            //   priority: -20,
            //   reuseExistingChunk: true,
            // },
            default: false,
            styles: {
              name: 'styles',
              test: /\.(s?css|less|sass)$/,
              chunks: 'all',
              enforce: true,
              priority: 10,
            },
            common: {
              name: 'chunk-common',
              chunks: 'all',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0,
              priority: 1,
              enforce: true,
              reuseExistingChunk: true,
            },
            vendors: {
              name: 'chunk-vendors',
              test: /[\\/]node_modules[\\/]/,
              chunks: 'all',
              priority: 2,
              enforce: true,
              reuseExistingChunk: true,
            },
          },
        }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
   
})


module.exports = (env, argv) => {
  console.log('argv.mode=',argv.mode) // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  // return smp.wrap(config);
  return config;
}

// 代码懒加载 import().then()