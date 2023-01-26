const path = require('path');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer')

module.exports = (env, argv) => {
	return {
		entry: [path.resolve(__dirname, './src/injector.js')],
		output: {
			path: path.resolve(__dirname, './bundle'),
			filename: argv.mode === "development" ? 'main.js' : "strapify.js"
		},
		//mode: 'production',
		//mode: 'development',

		module: {

		},
		plugins: [
			new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
		]
	}
}