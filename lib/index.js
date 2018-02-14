const APIReq = require('./api-request')

const CLIENTS = {
	OWNR: 'ownr'
}
const CLIENT_BUNDLES = {
	[CLIENTS.OWNR]: {
		ORGANIZATION: 'ownr-organization'
	}
}

class FoundedAPIGateway {
	constructor (options) {
		if (!options.client || !CLIENTS[options.client.toUpperCase()]) {
			throw new Error('client value must be valid!')
		}
		this.client = options.client
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
				path: `/documents/bundle/${CLIENT_BUNDLES[this.client].ORGANIZATION}`
			})
			createBundleReq.post(data).then(response => {
				if (response.statusCode === 202) {
					const refId = response.body
					if (refId) {
						const waitForBundleReq = new APIReq(this.apiDefaults, {
							path: `/documents/${refId}`,
							encoding: 'binary'
						})
						return waitForBundleReq.poll().then(response => {
							resolve(response.body)
						})
					} else {
						reject(new Error('Reference Id missing'))
					}
				} else {
					reject(new Error('Unknown success response'))
				}
			}).catch(error => {
				reject(new Error(error.message))
			})
		})
	}
}

module.exports = options => new FoundedAPIGateway(options)
