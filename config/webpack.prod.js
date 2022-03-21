const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const paths = require('./paths');

module.exports = merge(common, {
    mode: 'production',
    //本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快
    // 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
    // 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 module
    devtool: false,
    output: {
      path: paths.build,
      publicPath: '/',
      filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
        rules: [
          // Styles: Inject CSS into the head with source maps
          {
            test: /\.s(a|c)ss$/,
            use: [
              MiniCssExtractPlugin.loader,
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