const webpackConfig = require('webpack-config');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
// const fs = require('fs');

const Config = webpackConfig.Config;

// const nodeModules = {};
// fs.readdirSync('node_modules')
// 	.filter(x => ['.bin', '.yarn-integrity'].indexOf(x) === -1)
// 	.forEach(mod => {
// 		nodeModules[mod] = 'commonjs ' + mod;
// 	});

module.exports = new Config().merge({
	target: 'electron-renderer',
	externals: [nodeExternals({
		whitelist: [/sigma/, 'app']
	})],
	output: {
		filename: 'electron.js'
	},
	plugins: [
		new webpack.DefinePlugin({
			__TARGET__: JSON.stringify('electron')
		})
	]
});
