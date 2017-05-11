const webpackConfig = require('webpack-config');
const webpack = require('webpack');

const Config = webpackConfig.Config;

module.exports = new Config().merge({
	devtool: 'cheap-module-source-map',
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		new webpack.DefinePlugin({
			__NODE_ENV__: JSON.stringify('production'),
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
	]
});
