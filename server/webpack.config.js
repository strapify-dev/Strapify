const path = require('path');

module.exports = {
	entry: ['./injector.js'],
	output: {
		path: path.resolve(__dirname, 'bundle'),
		filename: 'main.js'
	},
	//mode: 'production',
	mode: 'development',

	module: {

    }
}