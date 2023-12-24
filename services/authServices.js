const User = require('../models/user')

const getUser = async params => {
	return await User.findOne({ ...params })
}

const getUserById = async id => {
	return await User.findById(id)
}

const addUser = async body => {
	return await User.create({ ...body })
}

const updateUser = async (_id, body) => {
	return await User.findByIdAndUpdate(_id, { ...body }, { new: true })
}

const deleteUserById = async _id => {
	return await User.findByIdAndDelete(_id)
}

module.exports = {
	getUser,
	getUserById,
	addUser,
	updateUser,
	deleteUserById,
}
