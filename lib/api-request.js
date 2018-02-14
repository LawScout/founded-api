const request = require('request-promise-native')

const API_HOST = 'api.founded.io'
const API_VERSION = '/v1'

class APIRequest {
	constructor (...options) {
		let mergedOptions = Object.assign({}, ...options)
		this.host = mergedOptions.host || API_HOST
		this.protocol = mergedOptions.protocol || 'https:'
		this.apiKey = mergedOptions.apiKey
		this.path = mergedOptions.path
		this.pollRate = mergedOptions.pollRate || 3000
		this.pollMaxRetries = mergedOptions.pollMaxRetries || 100
		this.encoding = mergedOptions.encoding === 'binary' ? null : 'utf8'
	}

	get url () {
		return `${this.protocol}//${this.host}${API_VERSION}${this.path}`
	}

	request (options) {
		const finalReqOptions = Object.assign({}, options, {
			method: options.method || 'GET',
			resolveWithFullResponse: true,
			headers: {
				'x-founded-gateway-api-key': this.apiKey
			},
			encoding: this.encoding
		})
		return request(this.url, finalReqOptions)
	}

	get (query) {
		return this.request({ query: query })
	}

	post (payload) {
		return this.request({
			method: 'POST',
			json: true,
			body: payload
		})
	}

	poll (query) {
		return new Promise((resolve, reject) => {
			let retryCount = 1
			const req = () => this.get(query).then(retry).catch(reject)
			const retry = response => {
				if (response.statusCode === 204) {
					if (retryCount < this.pollMaxRetries) {
						retryCount++
						setTimeout(() => {
							req()
						}, this.pollRate)
					} else {
						reject(new Error('Too many polling retries'))
					}
				} else {
					resolve(response)
				}
			}
			req()
		})
	}
}

module.exports = APIRequest
