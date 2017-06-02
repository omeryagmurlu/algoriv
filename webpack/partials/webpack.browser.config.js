const webpackConfig = require('webpack-config');
const webpack = require('webpack');
const path = require('path');

const Config = webpackConfig.Config;

module.exports = new Config().merge({
	output: {
		filename: 'browser.js'
	},
	resolve: {
		alias: {
			'ALIAS-localstorage': path.resolve('webpack/fake_modules/browser-localstorage'),
			'ALIAS-babel': path.resolve('webpack/fake_modules/browser-babel')
		}
	},
	module: {
		rules: [
			{
				test: /babel-standalone.*\.js?$/,
				exclude: ['app'],
				use: ['script-loader']
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__BROWSER__: JSON.stringify(true),
			__ELECTRON__: JSON.stringify(false)
		})
	]
});
