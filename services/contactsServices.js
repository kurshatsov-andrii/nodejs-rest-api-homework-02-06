const Contacts = require('../models/contact')

const getContactById = async id => {
	return await Contacts.findById(id)
}

const getAllContacts = async (query, options) => {
	return await Contacts.find(query, '', { ...options })
}

const addContact = async body => {
	return await Contacts.create({ ...body })
}

const deleteContactById = async id => {
	return await Contacts.findByIdAndDelete(id)
}

const updateContact = async (id, body) => {
	return await Contacts.findByIdAndUpdate(
		id,
		{ ...body },
		{
			new: true,
		}
	)
}

module.exports = {
	getContactById,
	getAllContacts,
	addContact,
	deleteContactById,
	updateContact,
}
