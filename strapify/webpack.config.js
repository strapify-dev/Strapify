const path = require('path');
//const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = (env, argv) => {
	const plugins = [];
	if (env.analyze) {
		plugins.push(new WebpackBundleAnalyzer.BundleAnalyzerPlugin());
	}
	if (env.gzip) {
		plugins.push(new CompressionPlugin({
			algorithm: 'gzip',
		}));
	}

	return {
		entry: [path.resolve(__dirname, './src/injector.js')],
		output: {
			path: path.resolve(__dirname, './bundle'),
			filename: argv.mode === "development" ? 'main.js' : "strapify.js"
		},

		plugins: plugins
	}
}