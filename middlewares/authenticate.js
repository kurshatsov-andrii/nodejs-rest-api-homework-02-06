const jwt = require('jsonwebtoken')
const { HttpError } = require('../utils')
const { SECRET_KEY } = process.env
const { getUserById } = require('../services/authServices')

const authenticate = async (req, res, next) => {
	const { authorization = '' } = req.headers
	const [bearer, token] = authorization.split(' ')
	if (bearer !== 'Bearer') {
		next(HttpError(401, 'Not authorized'))
	}
	try {
		const { id } = jwt.verify(token, SECRET_KEY)
		const user = await getUserById(id)
		if (!user || !user.token || user.token !== token) {
			next(HttpError(401, 'Not authorized'))
		}
		req.user = user
		next()
	} catch (error) {
		next(HttpError(401, 'Not authorized'))
	}
}

module.exports = authenticate
