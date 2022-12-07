import mongoose from 'mongoose'
import supertest from 'supertest'
import { createServer } from '../app/server'
import { createDependencies } from '../app/dependency.root'
import config from '../app/config'

const testInputData = {
  name: 'John Connor',
  email: 'john.connor@testmail.com'
}

const expectedUser = {
  id: expect.any(String),
  email: 'john.connor@testmail.com',
  reg_token: '',
  photo_avatar: '',
  name: 'John Connor',
  phone: '',
  type: 'user',
  appointments: []
}
const expectedData = {
  success: true,
  data: expectedUser
}

config.storageService = 'mongodb-memory-server'
config.notificationPath = ''

const app = createServer()

describe('Test Users API', () => {
  beforeAll(async () => {
    await createDependencies(config)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  let userId: string
  describe('test post route', () => {
    test('should return a 200 and create user', async () => {
      const { statusCode, body } = await supertest(app).post('/api/v1/user/').send(testInputData)

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
      userId = body.data.id
      expectedUser.id = userId
    })
    test('should return a 400 incorrect input data', async () => {
      const testData: any = { ...testInputData }
      delete testData.email
      const { statusCode } = await supertest(app).post('/api/v1/user/').send(testData)

      expect(statusCode).toBe(400)
    })
  })

  describe('test get route', () => {
    test('should return 200 and get users', async () => {
      const { statusCode, body } = await supertest(app).get('/api/v1/user/')

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: [expectedUser] })
    })
    test('should return 200 and get user', async () => {
      const { statusCode, body } = await supertest(app).get(`/api/v1/user/${userId}`)

      expect(statusCode).toBe(200)
      expect(body).toEqual(expectedData)
    })
    test('should return 400 incorrect userId', async () => {
      const { statusCode } = await supertest(app).get(`/api/v1/user/${'000000000000'}`)

      expect(statusCode).toBe(400)
    })
  })

  describe('test delete route', () => {
    test('should return a 200 and get deleted user', async () => {
      const { statusCode, body } = await supertest(app).delete(`/api/v1/user/${userId}`)

      expect(statusCode).toBe(200)

      expect(body).toEqual(expectedData)
    })
    test('should return a 200 and get empty array', async () => {
      const { statusCode, body } = await supertest(app).get('/api/v1/user/')

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ success: true, data: [] })
    })
  })
})
