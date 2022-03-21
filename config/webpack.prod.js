const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 分离样式到一个文件内
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const paths = require('./paths');

const config = merge(common, {
    mode: 'development',
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
      
    ],
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), '...'],
        runtimeChunk: {
          name: 'runtime'
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
  return config;
}