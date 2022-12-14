import { Doctor } from '../model/doctor.model'
import { IDoctorDBService } from '../interface/doctor.interface'
import { Appointment } from '../model/appointment.model'

interface controllerResponce {
  success: boolean
  data?: Partial<Doctor>
  error?: string
}

class DoctorController {
  storageService: IDoctorDBService
  constructor(storageService: IDoctorDBService) {
    this.storageService = storageService
  }

  async createHandler(body: Partial<Doctor>) {
    try {
      const doctor = new Doctor(body)
      const dbResponce = await this.storageService.create(doctor)
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }

  async getListHandler(query: object = {}) {
    try {
      const dbResponce: Doctor[] = await this.storageService.getList(query)
      return {
        success: true,
        data: dbResponce.map((doctor) => {
          return doctor
        })
      }
    } catch (error: any) {
      return { success: false, error: error.message ?? 'Unknown error' }
    }
  }

  async getHandler(params: any): Promise<controllerResponce> {
    const { id } = params
    try {
      const dbResponce: Doctor | null = await this.storageService.get(id)
      if (!dbResponce) {
        return { success: false, error: 'Doctor not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async updateHandler(params: any, body: Partial<Doctor>) {
    const { id } = params
    const userData = new Doctor(body)
    try {
      const dbResponce: Doctor | null = await this.storageService.update(id, userData)
      if (!dbResponce) {
        return { success: false, error: 'Doctor not found' }
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
      const dbResponce: Doctor | null = await this.storageService.update(id, input)
      if (!dbResponce) {
        return { success: false, error: 'Doctor not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async addAppointment(id: string, appointment: Appointment) {
    try {
      if (!appointment.id) {
        return { success: false, error: 'Appointment with empty id' }
      }
      const dbResponce: Doctor | null = await this.storageService.addAppointment(id, appointment.id)
      if (!dbResponce) {
        return { success: false, error: 'Doctor not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  async deleteHandler(params: any) {
    const { id } = params
    try {
      const dbResponce: Doctor | null = await this.storageService.delete(id)
      if (!dbResponce) {
        return { success: false, error: 'Doctor not found' }
      }
      return { success: true, data: dbResponce }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export default DoctorController
