const webpackConfig = require('webpack-config');

const Config = webpackConfig.Config;
const environment = webpackConfig.environment;

environment.setAll({
	env: () => process.env.NODE_ENV || 'production',
	target: () => process.env.TARGET || 'node'
});

module.exports = new Config().extend('webpack/webpack.[env].[target].config.js');
