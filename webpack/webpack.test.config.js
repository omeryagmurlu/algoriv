const webpackConfig = require('webpack-config');
const nodeExternals = require('webpack-node-externals');

/**
 * Modified NodeStuffPlugin to replace __filename and __dirname with absolute path
 * @see https://github.com/webpack/webpack/blob/ca8b693c2c17bd06778476381fae23b3b21c0475/lib/NodeStuffPlugin.js
 * Modified the modified one not to give warnings
 */
function NodeRealPathPlugin() {}
NodeRealPathPlugin.prototype.apply = (compiler) => {
	function setModuleConstant(expressionName, fn) {
		compiler.plugin('compilation', (compilation, params) => {
			params.normalModuleFactory.plugin('parser', (parser) => {
				parser.plugin(`expression ${expressionName}`, () => {
					parser.state.current.addVariable(expressionName, JSON.stringify(fn(parser.state.module)));
					return true;
				});
			});
		});
	}

	setModuleConstant('__filename', module => module.resource);

	setModuleConstant('__dirname', module => module.context);
};

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
	'webpack/partials/webpack.dev.config.js': c => {
		c.module = undefined;
		return c;
	},
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
							presets: [['es2015'], 'react', 'es2016', 'es2017'],
							plugins: ['transform-class-properties', 'transform-object-rest-spread', 'syntax-dynamic-import']
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
	},
	plugins: [
		new NodeRealPathPlugin()
	]
}));
