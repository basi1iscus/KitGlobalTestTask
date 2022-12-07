import dayjs from 'dayjs'

import { IUser, User } from '../model/user.model'
import { IAppointment, Appointment } from '../model/appointment.model'
import { IUserDBService } from '../interface/user.interface'
import { INotificationService } from '../interface/notification.interface'
import { IDoctor } from '../model/doctor.model'
import { appointmentController } from '../dep.root'
import { doctorController } from '../dep.root'

interface controllerResponce {
  success: boolean,
  data?: Object,
  error?: string
}

class UserController {
  storageService: IUserDBService 
  notificationService: INotificationService | null = null
  constructor(storageService: IUserDBService) {
    this.storageService = storageService;
  }

  async createHandler(body: IUser) {
    try {
      const user = new User(body)
      const dbResponce = await this.storageService.create(user)
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }
  
  async createNotifications() {
    try {
      const filter: object = {
        active: true,
        date: {
          $gte: new Date()
        }
      }
      const dbResponce = await appointmentController.getListHandler(filter)
      if (dbResponce.success && dbResponce.data) {
        dbResponce.data.forEach((appointment) => {
            this.createNotificationForAppointment(appointment)
          })
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }
  
  async getListHandler(query: object = {}) {
    try {
      const dbResponce:IUser[] = await this.storageService.getList(query)
      return { success: true, data: dbResponce.map((user) => {
        return user
      }) }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }

  async getHandler(params: any): Promise<controllerResponce> {
    const { id }= params
    try {
      const dbResponce:IUser | null = await this.storageService.get(id)
      if (!dbResponce) {
        return { success: false, error: 'User not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async updateHandler(params: any, body: IUser) {
    const { id } = params
    const userData = new User(body)
    try {
      const dbResponce:IUser | null = await this.storageService.update(id, userData)
      if (!dbResponce) {
        return { success: false, error: 'User not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async patchHandler(params: any, body: any) {
    const { id } = params
    const input = { ...body }

    try {
      const dbResponce:IUser | null = await this.storageService.update(id, input)
      if (!dbResponce) {
        return { success: false, error: 'User not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async createNotificationForAppointment(appointment: IAppointment, userParam?: IUser,  doctorParam?: IDoctor): Promise<void> {
    if (this.notificationService) {
      let user: IUser | undefined = userParam
      let doctor: IDoctor | undefined = doctorParam

      if (!doctor) {
        doctor = (await doctorController.getHandler({ id: appointment.doctor})).data
      }
      if (!user) {
        user = (await this.getHandler({ id: appointment.user})).data
      }

      let notificationDate = dayjs((<Appointment>appointment).date).add(1, 'day').toDate()
      if (notificationDate > new Date()) {
        this.notificationService.addNotification(
            notificationDate,
            <User>user,
            `${notificationDate} | Привет ${user?.name}! Напоминаем что вы записаны к ${doctor?.spec} завтра в ${dayjs((<Appointment>appointment).date).format('DD/MM/YYYY HH:mm')}!`)
      }
      notificationDate = dayjs((<Appointment>appointment).date).add(2, 'hours').toDate()
      if (notificationDate > new Date()) {
        this.notificationService.addNotification(
          notificationDate,
          <User>user,
          `${notificationDate} | Привет ${user?.name}! Вам через 2 часа к ${doctor?.spec} в ${dayjs((<Appointment>appointment).date).format('HH:mm')}!`)
        }
      }
  }

  async addAppointment(id: string, appointment: IAppointment) {
    try {
      const user:IUser | null = await this.storageService.addAppointment(id, (<Appointment>appointment).id)
 
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      this.createNotificationForAppointment(appointment, user)

      return { success: true, data: user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async deleteHandler(params: any) {
    const { id } = params
    try {
      const dbResponce:IUser | null = await this.storageService.delete(id)
      if (!dbResponce) {
        return { success: false, error: 'User not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

}

export default UserController
