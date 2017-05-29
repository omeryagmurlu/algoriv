const webpackConfig = require('webpack-config');
const jsonImporter = require('node-sass-json-importer');
const path = require('path');

const Config = webpackConfig.Config;

const main = path.resolve(__dirname, '../..');

module.exports = new Config().merge({
	context: main,
	entry: {
		app: [
			'./app/index.js'
		]
	},
	output: {
		path: path.resolve(main, 'dist'),
		publicPath: 'dist/'
	},
	resolve: {
		alias: {
			app: path.resolve(main, 'app')
		}
	},
	module: {
		rules: [
			{
				test: /sigma.*\.js?$/, // the test to only select sigma files
				exclude: ['app'], // you ony need to check node_modules, so remove your application files
				use: ['script-loader'] // loading as script
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [['es2015', { modules: false }], 'react'],
							plugins: ['transform-class-properties', 'transform-object-rest-spread']
						}
					}
					// 'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[path][name]__[local]--[hash:base64:5]',
						minimize: true,
						camelCase: true
					}
				}]
			},
			{ // Module Css Files
				test: /\.css$/,
				include: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						minimize: true,
						camelCase: true
					}
				}]
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[path][name]__[local]--[hash:base64:5]',
						minimize: true,
						camelCase: true,
						importLoaders: 1
					}
				}, {
					loader: 'sass-loader',
					options: {
						includePaths: [],
						importer: jsonImporter
					}
				}]
			},
			{
				test: /\.md$/,
				use: [
					{
						loader: 'html-loader'
					},
					{
						loader: 'markdown-loader'
					}
				]
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: {
					loader: 'url-loader?limit=8192'
				}
			},
			{
				loader: 'url-loader',
				test: /\.(svg|eot|ttf|woff|woff2)?$/
			},
		]
	}
});
