const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const cssLoader = isProd ? ExtractTextPlugin.extract('css-loader!sass-loader') : ['style-loader', 'css-loader', 'sass-loader'];


const path = require('path');
const ip = require('ip');

const port = 3000;

const config = {
  devtool: '#eval-source-map',
  entry: {
    app: './demo/index.js',
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: '[name].[hash:5].js',
    publicPath: '',
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo/index.html',
      filename: 'index.html',
    })
  ],

  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    },
    { test: /\.(scss|css)$/, loader: cssLoader },
    {
      test: /\.(png|jpg|gif|ico)$/,
      loader: 'url-loader?limit=8192&name=assets/[name].[ext]'
    }]
  },

  devServer: {
    port: port,
    host: ip.address(),
    contentBase: "./demo",
    compress: true,
    stats: 'minimal',
  }
};

if (isProd) {
  config.devtool = '#source-map';
  config.plugins.push(
   
    new ExtractTextPlugin('app.[hash:5].css', {allChunks: true})
  );
}

module.exports = config;
