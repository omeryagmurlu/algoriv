const webpackConfig = require('webpack-config');
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
			{
				loader: 'raw-loader',
				test: /\.(txt)?$/
			},
		]
	}
});
