const path = require('path');

module.exports = {
	entry: {
		app: [
			'react-hot-loader/patch',
			'./app/index.js'
		]
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'public', 'js/'),
		publicPath: 'public/js/'
	},
	devtool: 'inline-source-map',
	devServer: {
		hot: true,
		publicPath: 'http://localhost:8080/public/js'
	},
	module: {
		rules: [
			{
				test: /sigma.*\.js?$/, // the test to only select sigma files
				exclude: ['app'], // you ony need to check node_modules, so remove your application files
				use: ['script-loader'] // loading as script
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: [['es2015', { modules: false }], 'react'],
							plugins: ['transform-class-properties', 'transform-object-rest-spread', 'react-hot-loader/babel']
						}
					}
					// 'eslint-loader'
				]
			},
			{
				test: /\.css$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[path][name]__[local]--[hash:base64:5]',
						minimize: true,
						camelCase: true
					}
				}]
			},
			{ // Module Css Files
				test: /\.css$/,
				include: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						minimize: true,
						camelCase: true
					}
				}]
			},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: [{
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[path][name]__[local]--[hash:base64:5]',
						minimize: true,
						camelCase: true
					}
				}, {
					loader: 'sass-loader'
				}]
			},
			{
				test: /\.(jpg|png|gif)$/,
				use: {
					loader: 'url-loader?limit=8192'
				}
			},
		]
	}
};
