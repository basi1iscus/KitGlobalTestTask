// Mongoose
import MongooseConnect from './service/mongoose/dbconnect'
import UserMongooseService from './service/mongoose/user.service'
import DoctorMongooseService from './service/mongoose/doctor.service'
import AppointmentMongooseService from './service/mongoose/appointment.service'

import UserController from './controller/user.controller'
import DoctorController from './controller/doctor.controller'
import AppointmentsController from './controller/appointments.controller'

import { IUserDBService } from './interface/user.interface'
import { IDoctorDBService } from './interface/doctor.interface'
import { IAppointmentDBService } from './interface/appointment.interface'
import { ILogger } from './interface/logger.interface'

import { FSNotificationService } from './service/notification/fs.notification'
import { PinoLogger } from './utils/logger'

export let userController: UserController
export let doctorController: DoctorController
export let appointmentController: AppointmentsController
export const log: ILogger = new PinoLogger()

export async function createDependencies(config: any) {
  let databaseConnect: any
  let userDBService: IUserDBService
  let doctorDBService: IDoctorDBService
  let appointmentDBService: IAppointmentDBService

  switch (config.storageService) {
    case 'mongoose': {
      databaseConnect = new MongooseConnect()
      await databaseConnect.connect(config.mongoUri, config.databaseName)
      userDBService = new UserMongooseService()
      userController = new UserController(userDBService)
      doctorDBService = new DoctorMongooseService()
      doctorController = new DoctorController(doctorDBService)
      appointmentDBService = new AppointmentMongooseService()
      appointmentController = new AppointmentsController(appointmentDBService)
      break
    }
  }

  if (config.notificationPath) {
    const notification = new FSNotificationService(config.notificationPath)
    userController.notificationService = notification
    userController.createNotifications()
  }
}
