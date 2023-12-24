const { HttpError, ctrlWrapper } = require('../utils')
const {
	getContactById,
	getAllContacts,
	addContact,
	deleteContactById,
	updateContact,
} = require('../services/contactsServices')

const getAll = async (req, res, next) => {
	const { page = 1, limit = 20, favorite } = req.query
	const skip = (page - 1) * limit
	const { _id: owner } = req.user
	const query = favorite ? { owner, favorite } : { owner }
	const result = await getAllContacts(query, '', { skip, limit })
	res.json(result)
}

const getById = async (req, res, next) => {
	const { contactId } = req.params
	const { _id: owner } = req.user
	const result = await getContactById(contactId).where('owner').equals(owner)
	if (!result) {
		throw HttpError(404, 'Not found')
	}
	res.json(result)
}

const add = async (req, res, next) => {
	const { _id: owner } = req.user
	const result = await addContact({ ...req.body, owner })
	res.status(201).json(result)
}

const deleteById = async (req, res, next) => {
	const { contactId } = req.params
	const { _id: owner } = req.user
	const contact = await getContactById(contactId).where('owner').equals(owner)
	if (!contact) {
		throw HttpError(404, 'Not found')
	}
	const result = await deleteContactById(contactId)
	if (!result) {
		throw HttpError(404, 'Not found')
	}
	res.status(200).json({ message: 'contact deleted' })
}

const updateById = async (req, res, next) => {
	const { contactId } = req.params
	const { _id: owner } = req.user
	const contact = await getContactById(contactId).where('owner').equals(owner)
	if (!contact) {
		throw HttpError(404, 'Not found')
	}
	const result = await updateContact(contactId, req.body, {
		new: true,
	})
	if (!result) {
		throw HttpError(404, 'Not found')
	}
	res.json(result)
}

const updateStatusContact = async (req, res, next) => {
	const { contactId } = req.params
	const { _id: owner } = req.user
	const contact = await getContactById(contactId).where('owner').equals(owner)
	if (!contact) {
		throw HttpError(404, 'Not found')
	}
	const result = await updateContact(contactId, req.body, {
		new: true,
	})
	if (!result) {
		throw HttpError(404, 'Not found')
	}
	res.json(result)
}

module.exports = {
	getAll: ctrlWrapper(getAll),
	getById: ctrlWrapper(getById),
	add: ctrlWrapper(add),
	deleteById: ctrlWrapper(deleteById),
	updateById: ctrlWrapper(updateById),
	updateStatusContact: ctrlWrapper(updateStatusContact),
}
