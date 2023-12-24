const Joi = require('joi')
const authSubscription = ['starter', 'pro', 'business']

const registerSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
	subscription: Joi.string()
		.valid(...authSubscription)
		.default('starter'),
})
const loginSchema = Joi.object({
	password: Joi.string().required(),
	email: Joi.string().required(),
})
const emailSchema = Joi.object({
	email: Joi.string().required().messages({
		'any.required': 'missing required field email',
	}),
})

module.exports = {
	registerSchema,
	loginSchema,
	emailSchema,
}
