import dayjs from 'dayjs'

import { IAppointment, Appointment } from '../model/appointment.model'
import { IAppointmentDBService } from '../interface/appointment.interface'
import { doctorController } from '../dep.root'
import { userController } from '../dep.root'
import { Doctor } from '../model/doctor.model'
import { User } from '../model/user.model'

const MAX_APPOINMETS_PER_DAY = 3

interface controllerResponce {
  success: boolean,
  data?: Object,
  error?: string
}

class AppointmentController {
  storageService: IAppointmentDBService  
  constructor(storageService: IAppointmentDBService) {
    this.storageService = storageService;
  }

  async createHandler(body: IAppointment) {
    try {
      const filter: object = {
        doctor: body.doctor,
        active: true,
        date: {
          $gte: dayjs(body.date).startOf('day'),
          $lte: dayjs(body.date).endOf('day')
        }
      }
      const appointmentsPerDay: number = await this.storageService.getCount(filter)
      if (appointmentsPerDay >= MAX_APPOINMETS_PER_DAY ) {
        return { success: false, error: 'The doctor is too busy this day!' }
      }
      const user = new Appointment(body)
      const dbResponce = await this.storageService.create(user)
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }

  async getListHandler(query: object = {}) {
    try {
      const dbResponce:IAppointment[] = await this.storageService.getList(query)
      return { success: true, data: dbResponce.map((appointment) => {
        return appointment
      }) }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }

  async getHandler(params: any): Promise<controllerResponce> {
    const { id } = params
    try {
      const dbResponce:IAppointment | null = await this.storageService.get(id)
      if (!dbResponce) {
        return { success: false, error: 'Appointment not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async updateHandler(params: any, body: IAppointment) {
    const { id } = params
    const data = new Appointment(body)
    try {
      const dbResponce:IAppointment | null = await this.storageService.update(id, data)
      if (!dbResponce) {
        return { success: false, error: 'Appointment not found' }
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
      const dbResponce:IAppointment | null = await this.storageService.update(id, input)
      if (!dbResponce) {
        return { success: false, error: 'Appointment not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async acceptAppointment(params: any, body: any) {
    const { id } = params
    try {
      const appointment:IAppointment | null = await this.storageService.get(id)
      if (!appointment) {
        return { success: false, error: 'Appointment not found' }
      }
      if (appointment.doctor) {
        await doctorController.addAppointment(appointment.doctor instanceof Doctor ? appointment.doctor.id : appointment.doctor, appointment)
      }
      if (appointment.user) {
        await userController.addAppointment(appointment.user instanceof User ? appointment.user.id : appointment.user, appointment)
      }
      if (+(appointment.date ?? 0) > +Date.now()) {
        const dbResponce:IAppointment | null = await this.storageService.update(id, { active: true })
        return { success: true, data: dbResponce }
      }
      return { success: true, data: appointment }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async rejectAppointment(params: any, body: any) {
    const { id } = params
    try {
      const result = await doctorController.getListHandler({ appointments_accepted: id })
      if (result.success && (result.data?.length)) {
        return { success: false, error: 'Appointment already accepted'}  
      }
      const dbResponce:controllerResponce = await this.deleteHandler({ id })
      return dbResponce
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async deleteHandler(params: any) {
    const { id } = params
    try {
      const dbResponce:IAppointment | null = await this.storageService.delete(id)
      if (!dbResponce) {
        return { success: false, error: 'Appointment not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

}

export default AppointmentController
