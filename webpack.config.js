const webpack = require('webpack')
const path = require('path')
const PROD = JSON.parse(process.env.PROD_ENV || '0')

// To create prod build, PROD_ENV=1 webpack
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/root.js',
  output: {
    filename: PROD ? 'bundle.min.js' : 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  plugins: PROD ? [
    new UglifyJSPlugin({})
  ] : [],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]',
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  mode: 'development',
  watch: true
};