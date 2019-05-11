const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';


const path = require('path');
const ip = require('ip');

const port = 3000;

const config = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	target: 'web',
	// Don't attempt to continue if there are any errors.
	bail: true,
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
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},
		{
			test: /\.(scss|css)$/,
			use: isProd ? [
				{
					loader: MiniCssExtractPlugin.loader,
				},
				'css-loader',
				'sass-loader',
			] : ['style-loader', 'css-loader', 'sass-loader'],
		},
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
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: 'app.[contenthash:5].css',
			chunkFilename: 'app_[id].[contenthash:5].css',
		}),
	);
}

module.exports = config;
