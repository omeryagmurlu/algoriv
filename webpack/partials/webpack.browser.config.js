const webpackConfig = require('webpack-config');
const webpack = require('webpack');

const Config = webpackConfig.Config;

module.exports = new Config().merge({
	output: {
		filename: 'browser.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			__TARGET__: JSON.stringify('browser')
		})
	]
});
