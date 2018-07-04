const debug = require('debug')('founded-api')
const APIReq = require('./api-request')

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
}

module.exports = options => new FoundedAPIGateway(options)
