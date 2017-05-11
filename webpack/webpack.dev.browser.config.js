const webpackConfig = require('webpack-config');

const Config = webpackConfig.Config;

module.exports = new Config().extend({
	'webpack/partials/webpack.base.config.js': conf => {
		conf.module.rules.find(v => v.test.toString() === /\.js$/.toString()).use.find(v => v.loader === 'babel-loader').options.plugins.push('react-hot-loader/babel');

		return conf;
	},
	'webpack/partials/webpack.dev.config.js': c => c,
	'webpack/partials/webpack.browser.config.js': c => c
}).merge({
	entry: {
		app: [
			'react-hot-loader/patch',
		]
	},
	devServer: {
		hot: true,
		publicPath: 'http://localhost:8080/public/js'
	}
});
