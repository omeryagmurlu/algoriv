const webpackConfig = require('webpack-config');

const Config = webpackConfig.Config;

module.exports = new Config().extend(
	'webpack/partials/webpack.base.config.js',
	'webpack/partials/webpack.prod.config.js',
	'webpack/partials/webpack.browser.config.js'
);
