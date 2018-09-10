const debug = require('debug')('founded-api')
const APIReq = require('./api-request')
const fs = require('fs')
class FoundedAPIGateway {
	constructor (options) {
		if (!options.apiKey) {
			throw new Error('apiKey value must be defined!')
		}
		this.apiDefaults = {
			apiKey: options.apiKey,
			host: options.host,
			protocol: options.protocol
		}
	}

	getOrganizationBundle (data) {
		return new Promise((resolve, reject) => {
			// post the data to the gateway and then start polling for its completion
			const createBundleReq = new APIReq(this.apiDefaults, {
				path: `/documents/bundle/organization`
			})
			debug('request bundle')
			createBundleReq.post(data).then(response => {
				if (response.statusCode === 202) {
					debug('request bundle success')
					const refId = response.body
					if (refId) {
						const waitForBundleReq = new APIReq(this.apiDefaults, {
							path: `/documents/${refId}`,
							encoding: 'binary'
						})
						debug('request bundle begin polling')
						return waitForBundleReq.poll().then(response => {
							resolve(response.body)
						})
					} else {
						debug('request bundle response missing reference id')
						reject(new Error('Reference Id missing'))
					}
				} else {
					debug(`request bundle response successful but unknown (${response.statusCode})`)
					reject(new Error(`Unknown success response ${response.statusCode}`))
				}
			}).catch(error => {
				debug('request bundle failed')
				reject(new Error(error.message))
			})
		})
	}

	parseArticles (jurisdiction, localPath) {
		return new Promise((resolve, reject) => {
			fs.access(localPath, fs.F_OK, error => {
				if (error) {
					reject(error)
				} else {
					const parseArticlesReq = new APIReq(this.apiDefaults, {
						path: `/documents/parse/articles/${jurisdiction}`
					})
					const options = {
						method: 'POST',
						formData: {
							document: fs.createReadStream(localPath)
						}
					}
					debug('request parse articles')
					parseArticlesReq.request(options).then(response => {
						if (response.statusCode === 200) {
							debug('request parse articles success')
							const details = response.body
							if (details) {
								resolve(details)
							} else {
								debug('request parse articles incomplete')
								reject(new Error('Parse articles incomplete'))
							}
						} else {
							debug(`request parse articles response successful but unknown (${response.statusCode})`)
							reject(new Error(`Unknown success response ${response.statusCode}`))
						}
					}).catch(error => {
						debug('request parse articles failed')
						reject(new Error(error.message))
					})
				}
			})
		})
	}
}

module.exports = options => new FoundedAPIGateway(options)
