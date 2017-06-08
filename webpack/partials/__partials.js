const jsonImporter = require('node-sass-json-importer');

exports.css = {
	test: /\.css$/,
	use: [{
		loader: 'css-loader',
		options: {
			modules: true,
			localIdentName: '[path][name]__[local]--[hash:base64:5]',
			minimize: true,
			camelCase: true
		}
	}]
};
exports.scss = {
	test: /\.scss$/,
	exclude: /(node_modules|bower_components)/,
	use: [{
		loader: 'css-loader',
		options: {
			modules: true,
			localIdentName: '[path][name]__[local]--[hash:base64:5]',
			minimize: true,
			camelCase: true,
			importLoaders: 1
		}
	}, {
		loader: 'sass-loader',
		options: {
			includePaths: [],
			importer: jsonImporter
		}
	}]
};
