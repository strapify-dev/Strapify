const path = require('path');

module.exports = (env, argv) => {
	return {
		entry: [path.resolve(__dirname, './strapify-src/injector.js')],
		output: {
			path: path.resolve(__dirname, './bundle'),
			filename: argv.mode === "development" ? 'main.js' : "strapify.js"
		},
		//mode: 'production',
		//mode: 'development',

		module: {

		}
	}
}