
const fs = require('fs')
const sha256File = require('sha256-file')


let _this

class Files {
	constructor() {
		_this = this

		this.fs = fs

	}

	// Generate a SHA256 hash 'fingerprint' of a file.
	getSha256Hash(filePath) {
		try {
			// Input Validation
			if (!filePath || typeof filePath !== 'string') {
				throw new Error('filePath must be a string!')
			}
			return new Promise((resolve, reject) => {
				if (!_this.fs.existsSync(filePath)) {
					throw reject(new Error('no such file'))
				}

				sha256File(filePath, function (error, sum) {
					if (error) return reject(error)
					resolve(sum)
				})
			})
		} catch (err) {
			console.error('Error in lib/encryption.js/makeDir()')
			throw err
		}
	}
	async readDir(path) {
		try {
			return new Promise((resolve, reject) => {
				// Make the directory for storing the encrypted files.
				_this.fs.readdir(
					path,
					// Callback after directory has been created.
					async (err, names) => {
						if (err) return reject(err)
						resolve(names)
					}
				)
			})
		} catch (err) {
			console.error('Error in lib/files/readDir()')
			throw err
		}
	}
	async rmDir(path) {
		try {
			return new Promise((resolve, reject) => {
				// Make the directory for storing the encrypted files.
				_this.fs.unlink(
					path,
					// Callback after directory has been created.
					async (err, names) => {
						if (err) return reject(err)
						resolve(names)
					}
				)
			})
		} catch (err) {
			console.error('Error in lib/files/readDir()')
			throw err
		}
	}
	async rename(input, output) {
		try {
			return new Promise((resolve, reject) => {
				// Make the directory for storing the encrypted files.
				_this.fs.rename(
					input,
					output,
					// Callback after directory has been created.
					async (err, names) => {
						if (err) return reject(err)
						resolve(names)
					}
				)
			})
		} catch (err) {
			console.error('Error in lib/files/rename()')
			throw err
		}
	}
	async createDir(path) {
		try {
			return new Promise((resolve, reject) => {
				// Make the directory for storing the encrypted files.
				_this.fs.mkdir(
					path,
					// Callback after directory has been created.
					async (err) => {
						if (err) return reject(err)
						resolve(true)
					}
				)
			})
		} catch (err) {
			console.error('Error in lib/files/createDir()')
			throw err
		}
	}
	writeJSON(obj, fileName) {
		return new Promise(function (resolve, reject) {
			try {
				if (!obj) {
					throw new Error('obj property is required')
				}
				if (!fileName || typeof fileName !== 'string') {
					throw new Error('fileName property must be a string')
				}

				const fileStr = JSON.stringify(obj, null, 2)
				_this.fs.writeFile(fileName, fileStr, function (err) {
					if (err) {
						console.error('Error while trying to write file: ')
						throw err
					} else {
						// console.log(`${fileName} written successfully!`)
						return resolve()
					}
				})
			} catch (err) {
				console.error('Error trying to write out object in util.js/_writeJSON().')
				return reject(err)
			}
		})
	}

	readJSON(fileName) {
		return new Promise(function (resolve, reject) {
			try {
				if (!fileName || typeof fileName !== 'string') {
					throw new Error('fileName property must be a string')
				}

				_this.fs.readFile(fileName, (err, data) => {
					if (err) {
						if (err.code === 'ENOENT') {
							console.log('.json file not found!')
						} else {
							console.log(`err: ${JSON.stringify(err, null, 2)}`)
						}

						throw err
					}

					const obj = JSON.parse(data)

					return resolve(obj)
				})
			} catch (err) {
				console.error('Error trying to read JSON file in util.js/_readJSON().')
				return reject(err)
			}
		})
	}
}

module.exports = Files