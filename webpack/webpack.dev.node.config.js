const webpackConfig = require('webpack-config');

const Config = webpackConfig.Config;

module.exports = new Config().extend(
	'webpack/partials/webpack.base.config.js',
	'webpack/partials/webpack.dev.config.js',
	'webpack/partials/webpack.node.config.js'
);
