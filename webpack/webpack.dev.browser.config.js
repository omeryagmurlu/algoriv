const webpack = require('webpack');
const webpackConfig = require('webpack-config');

const Config = webpackConfig.Config;

console.dir(new Config().extend({
	'webpack/partials/webpack.base.config.js': conf => {
		conf.module.rules.find(v => v.test.toString() === /\.js$/.toString()).use.find(v => v.loader === 'babel-loader').options.plugins.push('react-hot-loader/babel');
		conf.entry.app = [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/only-dev-server',
		].concat(conf.entry.app);

		return conf;
	},
	'webpack/partials/webpack.dev.config.js': c => c,
	'webpack/partials/webpack.browser.config.js': c => c
}).merge({
	devServer: {
		hot: true,
		publicPath: 'http://localhost:8080/dist/'
	},
	plugins: [
		new webpack.NamedModulesPlugin()
	]
}), {depth:null});

module.exports = new Config().extend({
	'webpack/partials/webpack.base.config.js': conf => {
		conf.module.rules.find(v => v.test.toString() === /\.js$/.toString()).use.find(v => v.loader === 'babel-loader').options.plugins.push('react-hot-loader/babel');
		conf.entry.app = [
			'react-hot-loader/patch',
			'webpack-dev-server/client?http://localhost:8080',
			'webpack/hot/only-dev-server',
		].concat(conf.entry.app);

		return conf;
	},
	'webpack/partials/webpack.dev.config.js': c => c,
	'webpack/partials/webpack.browser.config.js': c => c
}).merge({
	devServer: {
		hot: true,
		publicPath: 'http://localhost:8080/dist/'
	},
	plugins: [
		new webpack.NamedModulesPlugin()
	]
});
