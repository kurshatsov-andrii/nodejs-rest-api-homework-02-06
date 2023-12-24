const express = require('express')
const ctrl = require('../../controllers/auth')
const {
	emptyBody,
	validateBody,
	authenticate,
	upload,
	jimp,
} = require('../../middlewares')
const schemas = require('../../schemas/userSchemas')
const router = express.Router()

router.post(
	'/register',
	emptyBody(),
	validateBody(schemas.registerSchema),
	ctrl.register
)
router.get('/verify/:verificationToken', ctrl.verify)
router.post(
	'/verify',
	emptyBody('missing required field email'),
	validateBody(schemas.emailSchema),
	ctrl.resendVerifyEmail
)
router.post(
	'/login',
	emptyBody(),
	validateBody(schemas.loginSchema),
	ctrl.login
)
router.get('/current', authenticate, ctrl.current)
router.post('/logout', authenticate, ctrl.logout)
router.patch('/', authenticate, ctrl.updateSubscription)

router.patch(
	'/avatars',
	authenticate,
	upload.single('avatar'),
	jimp,
	ctrl.updateAvatars
)
router.delete('/', authenticate, ctrl.deleteUser)

module.exports = router
