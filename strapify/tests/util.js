const fs = require('fs')

function writeFile(filePath, contents) {
	//delete the file if it already exists
	if (fs.existsSync(filePath)) {
		fs.unlink(filePath, (err) => {
			err && console.error(err)
		})
	}

	//create the file
	fs.writeFile(filePath, contents, (err) => {
		err && console.error(err)
	})
}

function readFile(filePath) {
	return fs.readFileSync(filePath, 'utf8')
}

function fileExists(filePath) {
	return fs.existsSync(filePath)
}

export {
	writeFile, readFile, fileExists
}