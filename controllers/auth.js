const path = require('path')
const fs = require('fs/promises')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const { ctrlWrapper, HttpError, verifyEmail } = require('../utils')
const { sendEmail } = require('../middlewares')
const {
	getUser,
	addUser,
	updateUser,
	deleteUserById,
} = require('../services/authServices')

const { SECRET_KEY, BASE_URL } = process.env
const authSubscription = ['starter', 'pro', 'business']
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')

const register = async (req, res) => {
	const { email, password } = req.body
	const user = await getUser({ email })
	if (user) {
		throw HttpError(409, 'Email in use')
	}
	const verificationToken = nanoid()
	const hashPassword = await bcrypt.hash(password, 10)
	const avatarURL = gravatar.url(email, { s: '250' })
	const newUser = await addUser({
		...req.body,
		password: hashPassword,
		avatarURL,
		verificationToken,
	})
	// console.log(newUser);
	await sendEmail(verifyEmail(email, BASE_URL, verificationToken))

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription || 'starter',
		},
	})
}

const verify = async (req, res) => {
	const { verificationToken } = req.params
	const user = await getUser({ verificationToken })
	if (!user) {
		throw HttpError(404, 'User not found')
	}
	await updateUser(user._id, {
		verificationToken: null,
		verify: true,
	})
	res.json({ message: 'Verification successful' })
}

const resendVerifyEmail = async (req, res) => {
	const { email } = req.body
	const user = await getUser({ email })
	if (!user) {
		throw HttpError(404, 'User not found')
	}
	if (user.verify) {
		throw HttpError(400, 'Verification has already been passed')
	}
	await sendEmail(verifyEmail(email, BASE_URL, user.verificationToken))
	res.json({ message: 'Verification email sent' })
}

const login = async (req, res) => {
	const { email, password } = req.body
	const user = await getUser({ email })
	if (!user) {
		throw HttpError(401, 'Email or password is wrong')
	}
	if (!user.verify) {
		throw HttpError(401, 'Email not verified')
	}
	const comparePassword = await bcrypt.compare(password, user.password)
	if (!comparePassword) {
		throw HttpError(401, 'Email or password is wrong')
	}
	const payload = {
		id: user._id,
	}
	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' })
	await updateUser(user._id, { token })
	res.json({
		token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	})
}

const current = async (req, res) => {
	const { email, subscription } = req.user
	res.json({
		email,
		subscription,
	})
}
const logout = async (req, res) => {
	const { _id } = req.user
	await updateUser(_id, { token: '' })
	res.status(204).json({ message: 'logout successful' })
}

const updateSubscription = async (req, res) => {
	const { _id } = req.user
	const { subscription } = req.body
	if (!authSubscription.includes(subscription)) {
		throw HttpError(400, 'invalid value')
	}
	const result = await updateUser(_id, req.body)
	if (!result) {
		throw HttpError(404, 'Not found')
	}
	res.json(result)
}

const updateAvatars = async (req, res) => {
	const { _id } = req.user
	const { path: tempUpload, filename } = req.file
	const resultUpload = path.join(avatarsDir, filename)
	await fs.rename(tempUpload, resultUpload)
	const avatarURL = path.join('avatars', filename)
	const result = await updateUser(_id, { avatarURL })
	if (!result) {
		throw HttpError(400, 'Bad request')
	}
	res.status(200).json({ avatarURL: avatarURL })
}

const deleteUser = async (req, res) => {
	const { _id } = req.user

	await deleteUserById(_id)
	res.json({ message: 'User deleted' })
}

module.exports = {
	register: ctrlWrapper(register),
	verify: ctrlWrapper(verify),
	resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
	login: ctrlWrapper(login),
	current: ctrlWrapper(current),
	logout: ctrlWrapper(logout),
	updateSubscription: ctrlWrapper(updateSubscription),
	updateAvatars: ctrlWrapper(updateAvatars),
	deleteUser: ctrlWrapper(deleteUser),
}
