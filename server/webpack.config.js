const path = require('path');

module.exports = {
	entry: [path.resolve(__dirname, './strapify-src/injector.js')],
	output: {
		path: path.resolve(__dirname, './bundle'),
		filename: 'main.js'
	},
	//mode: 'production',
	mode: 'development',

	module: {

	}
}