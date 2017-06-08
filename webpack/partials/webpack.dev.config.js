const webpackConfig = require('webpack-config');
const webpack = require('webpack');
const partials = require('./__partials');

const Config = webpackConfig.Config;

const prependStyleModule = rule => {
	rule.use.unshift({
		loader: 'style-loader'
	});
	return rule;
};

module.exports = new Config().merge({
	devtool: 'inline-source-map',
	module: {
		rules: [
			prependStyleModule(partials.css),
			prependStyleModule(partials.scss)
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__DEVELOPMENT__: JSON.stringify(true),
			__PRODUCTION__: JSON.stringify(false)
		})
	]
});
