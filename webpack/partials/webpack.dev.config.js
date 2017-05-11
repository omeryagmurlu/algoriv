const webpackConfig = require('webpack-config');
const webpack = require('webpack');

const Config = webpackConfig.Config;

module.exports = new Config().merge({
	devtool: 'inline-source-map',
	plugins: [
		new webpack.DefinePlugin({
			__NODE_ENV__: JSON.stringify('dev')
		})
	]
});
