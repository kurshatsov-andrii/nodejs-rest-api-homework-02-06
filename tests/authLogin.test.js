const mongoose = require('mongoose')
const { beforeAll, afterAll, expect, describe, test } = require('@jest/globals')
const request = require('supertest')
const app = require('../app')

require('dotenv').config()
mongoose.set('strictQuery', false)

describe('POST /login', () => {
	beforeAll(async () => {
		await mongoose.connect(process.env.DB_HOST)
	})
	const user = {
		password: '1234567',
		email: 'andr@gmail.com',
	}
	test('It should login user and return token', async () => {
		const logResponse = await request(app).post('/users/login').send(user)
		expect(logResponse.status).toBe(200)
		expect(logResponse.body.token).toBeTruthy()
		expect(logResponse.body.user).toBeInstanceOf(Object)
		expect(typeof logResponse.body.user.email).toBe('string')
		expect(typeof logResponse.body.user.subscription).toBe('string')
	})
	afterAll(async () => {
		await mongoose.connection.close()
	})
})
