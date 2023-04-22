const path = require('path');
const { EnvironmentPlugin } = require('webpack');
require('dotenv').config()
//const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => {
	const plugins = [];
	if (env.analyze) {
		//	plugins.push(new WebpackBundleAnalyzer.BundleAnalyzerPlugin());
	}
	if (env.gzip) {
		plugins.push(new CompressionPlugin({
			algorithm: 'gzip',
		}));
	}


	const version = process.env.VERSION;
	if (!version) throw new Error("VERSION environment variable not set. Please set it in the .env file.");

	plugins.push(new EnvironmentPlugin({
		VERSION: version,
		DEBUG: false
	}));

	return {
		entry: [path.resolve(__dirname, './src/injector.js')],
		output: {
			path: path.resolve(__dirname, './bundle'),
			filename: argv.mode === "development" ? `main.js` : `strapify-v${version}.js`
		},
		plugins: plugins,
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								['@babel/preset-env', { targets: "defaults" }]
							]
						}
					}
				}
			]
		}
	}
}