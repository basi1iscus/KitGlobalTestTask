import mongoose from 'mongoose'
import supertest from 'supertest'
import { createServer } from '../app/server'
import { createDependencies } from '../app/dependency.root'
import config from '../app/config'

const testInputData = {
  name: 'Gregory House',
  email: 'doctor.house@testmail.com',
  spec: 'infectologist'
}

const expectedDoctor = {
  id: expect.any(String),
  email: 'doctor.house@testmail.com',
  reg_token: '',
  photo_avatar: '',
  name: 'Gregory House',
  phone: '',
  spec: 'infectologist',
  free: true,
  type: 'doc',
  appointments_accepted: []
}

const expectedData = {
  success: true,
  data: expectedDoctor
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

  let doctorId: string
  describe('test post route', () => {
    test('should return a 200 and create doctor', async () => {
      const { statusCode, body } = await supertest(app).post('/api/v1/doctor/').send(testInputData)

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
      doctorId = body.data.id
      expectedDoctor.id = doctorId
    })
    test('should return a 400 incorrect input data', async () => {
      const testData: any = { ...testInputData }
      delete testData.email
      const { statusCode } = await supertest(app).post('/api/v1/doctor/').send(testData)

      expect(statusCode).toBe(400)
    })
  })

  describe('test get route', () => {
    test('should return 200 and get doctors', async () => {
      const { statusCode, body } = await supertest(app).get('/api/v1/doctor/')

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: [expectedDoctor] })
    })
    test('should return 200 and get doctor', async () => {
      const { statusCode, body } = await supertest(app).get(`/api/v1/doctor/${doctorId}`)

      expect(statusCode).toBe(200)
      expect(body).toEqual(expectedData)
    })
    test('should return 400 incorrect doctorId', async () => {
      const { statusCode } = await supertest(app).get(`/api/v1/doctor/${'000000000000'}`)

      expect(statusCode).toBe(400)
    })
  })

  describe('test delete route', () => {
    test('should return a 200 and get deleted doctor', async () => {
      const { statusCode, body } = await supertest(app).delete(`/api/v1/doctor/${doctorId}`)

      expect(statusCode).toBe(200)

      expect(body).toEqual(expectedData)
    })
    test('should return a 200 and get empty array', async () => {
      const { statusCode, body } = await supertest(app).get('/api/v1/doctor/')

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ success: true, data: [] })
    })
  })
})
