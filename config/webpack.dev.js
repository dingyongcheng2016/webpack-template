const { merge } = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'development',
    //本地开发首次打包慢点没关系，因为 eval 缓存的原因，rebuild 会很快
    // 开发中，我们每行代码不会写的太长，只需要定位到行就行，所以加上 cheap
    // 我们希望能够找到源代码的错误，而不是打包后的，所以需要加上 module
    devtool: 'eval-cheap-module-source-map',
    module: {
        rules: [
          // Styles: Inject CSS into the head with source maps
          {
            test: /\.(sc|sa)ss$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { sourceMap: true, importLoaders: 1, modules: false },
              },
              { loader: 'postcss-loader', options: { sourceMap: true } },
              { loader: 'sass-loader', options: { sourceMap: true } },
            ],
          },
        ],
    },
    // Spin up a server for quick development
    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
})