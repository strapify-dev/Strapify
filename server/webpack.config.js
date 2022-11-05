const path = require('path');

module.exports = {
	entry: ['./injector.js'],
	output: {
		path: path.resolve(__dirname, 'output'),
		filename: 'main.js'
	},
	//mode: 'production',
	mode: 'development',

	module: {

    }
}