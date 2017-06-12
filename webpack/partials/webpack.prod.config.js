const webpackConfig = require('webpack-config');
const webpack = require('webpack');
const partials = require('./__partials');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Config = webpackConfig.Config;

module.exports = new Config().merge({
	devtool: false,
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractTextPlugin.extract(partials.css.use),
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract(partials.scss.use),
			},
		]
	},
	plugins: [
		new ExtractTextPlugin('styles.css'),
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
