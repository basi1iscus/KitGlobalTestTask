import mongoose from 'mongoose'
import supertest from 'supertest'
import dayjs from 'dayjs'

import { createServer } from '../app/server'
import { createDependencies } from '../app/dependency.root'
import config from '../app/config'

const testUserInputData = {
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

const testDoctorInputData = {
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

const expectedApp = {
  id: expect.any(String),
  date: expect.any(String),
  user: '',
  doctor: '',
  active: false
}

const expectedData = {
  success: true,
  data: {}
}
const expectedErrorData = {
  success: false,
  error: expect.any(String)
}

const startDate = dayjs(new Date()).startOf('day').add(1, 'day').add(10, 'hours').toDate()

config.storageService = 'mongodb-memory-server'
config.notificationPath = ''

const app = createServer()
jest.setTimeout(10000)

describe('Test appointments API', () => {
  beforeAll(async () => {
    await createDependencies(config)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
  })

  let userId = ''
  let doctorId = ''
  const appointments = new Array(3)

  describe('test User & Doctor post route', () => {
    test('should return a 200 and create user', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/v1/user/')
        .send(testUserInputData)

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
      userId = body.data.id
      expectedUser.id = userId
    })
    test('should return a 200 and create doctor', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/v1/doctor/')
        .send(testDoctorInputData)

      expect(statusCode).toBe(200)

      expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
      doctorId = body.data.id
      expectedDoctor.id = doctorId

      let date = startDate
      for (let i = 0; i < 3; i++) {
        const testAppInputData = {
          date: date.toJSON(),
          user: userId,
          doctor: doctorId
        }
        appointments[i] = {
          id: '',
          body: { ...testAppInputData },
          expect: { ...expectedApp, ...testAppInputData }
        }
        date = dayjs(date).add(1, 'hours').toDate()
      }
    })
  })

  let appointmentId = ''
  describe('test appointments post route & accept', () => {
    test('should return a 200 and create 3 appointments', async () => {
      for (let i = 0; i < 3; i++) {
        const { statusCode, body } = await supertest(app)
          .post('/api/v1/appointment/')
          .send(appointments[i].body)
        expect(statusCode).toBe(200)
        expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
        appointments[i].expect.id = body?.data?.id
      }
    })

    test('should return 200 and accept appointments', async () => {
      for (let i = 0; i < 3; i++) {
        const { statusCode, body } = await supertest(app)
          .post(`/api/v1/appointment/${appointments[i].expect.id}/accept`)
          .send({})
        expect(statusCode).toBe(200)
        expect(body).toMatchObject({
          ...expectedData,
          data: { ...appointments[i].expect, active: true }
        })
      }
    })

    test('should return a 400 incorrect input data', async () => {
      const testData: any = { ...appointments[0].body }
      delete testData.date
      const { statusCode } = await supertest(app).post('/api/v1/appointment/').send(testData)

      expect(statusCode).toBe(400)
    })
  })

  describe('test accept already accepted route', () => {
    test('should return 500 already accepted', async () => {
      for (let i = 0; i < 3; i++) {
        const { statusCode, body } = await supertest(app).post(
          `/api/v1/appointment/${appointments[i].expect.id}/accept`
        )
        expect(statusCode).toBe(500)
        expect(body).toMatchObject({
          ...expectedErrorData,
          error: 'Appointment already accepted'
        })
      }
    })
  })

  describe('test post new route on busy and next day', () => {
    test('should error when more then 3 appointment per dey', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/v1/appointment/')
        .send(appointments[0].body)

      expect(statusCode).toBe(500)
      expect(body).toMatchObject(expectedErrorData)
    })

    let appointmentData: any
    test('should return 200 create appointment next day', async () => {
      appointmentData = {
        ...appointments[0].body,
        date: dayjs(startDate).add(1, 'day').toDate()
      }
      const { statusCode, body } = await supertest(app)
        .post('/api/v1/appointment/')
        .send(appointmentData)

      expect(statusCode).toBe(200)
      expect(body).toMatchObject({ ...expectedData, data: { id: expect.any(String) } })
      appointmentId = body?.data?.id
    })

    test('test reject appointment should return 200 and get deleted appointment', async () => {
      const { statusCode, body } = await supertest(app)
        .post(`/api/v1/appointment/${appointmentId}/reject`)
        .send({})

      expect(statusCode).toBe(200)

      expect(body).toEqual({
        ...expectedData,
        data: {
          ...expectedApp,
          ...appointmentData,
          id: appointmentId,
          date: appointmentData.date.toJSON()
        }
      })
    })
  })

  describe('test get list route', () => {
    test('should return a 200 and get array of 3 appointments', async () => {
      const { statusCode, body } = await supertest(app).get('/api/v1/appointment/')

      expect(statusCode).toBe(200)

      expect(body.data.length).toBe(3)
    })
  })
})
