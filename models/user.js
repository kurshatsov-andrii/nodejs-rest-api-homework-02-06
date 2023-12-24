const { Schema, model } = require('mongoose')
const { handleMongooseError } = require('../utils')
const authSubscription = ['starter', 'pro', 'business']

const userSchema = new Schema(
	{
		password: {
			type: String,
			required: [true, 'Set password for user'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: authSubscription,
			default: 'starter',
		},
		token: String,
		avatarURL: String,
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			required: [true, 'Verify token is required'],
		},
	},

	{ versionKey: false }
)

userSchema.post('save', handleMongooseError)
const User = model('user', userSchema)

module.exports = User
