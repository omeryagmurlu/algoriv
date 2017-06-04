const webpackConfig = require('webpack-config');
const nodeExternals = require('webpack-node-externals');

const Config = webpackConfig.Config;

module.exports = Object.assign({}, new Config().extend({
	'webpack/partials/webpack.base.config.js': c => {
		c.module = {};
		c.entry = undefined;
		c.context = undefined;
		c.output = undefined;
		c.externals = undefined;
		return c;
	},
	'webpack/partials/webpack.dev.config.js': c => c,
	'webpack/partials/webpack.elec.config.js': c => c
}).merge({
	target: 'node',
	externals: [nodeExternals({
		whitelist: ['app']
	})],
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [['es2015', { modules: false }], 'react'],
							plugins: ['transform-class-properties', 'transform-object-rest-spread']
						}
					}
				]
			},
			{
				test: /(LoadingView|graph\.module)/,
				include: /app/,
				use: {
					loader: 'null-loader'
				}
			},
			{
				test: /\.(jpg|png|gif|svg|eot|ttf|woff|woff2|txt|md|scss|css)$/,
				use: {
					loader: 'null-loader'
				}
			},
		]
	}
}));
