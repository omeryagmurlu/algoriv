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
			__PRODUCTION__: JSON.stringify(true),
			__DEVELOPMENT__: JSON.stringify(false),
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(),
	]
});
