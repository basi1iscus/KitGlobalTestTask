import { IUser, User } from '../model/user.model'
import { IUserDBService } from '../interface/user.interface'
import { string } from 'yargs';

interface controllerResponce {
  success: boolean,
  data?: Object,
  error?: string
}

class UserController {
  storageService: IUserDBService  
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

  async getListHandler() {
    try {
      const dbResponce:IUser[] = await this.storageService.getList()
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

  async addAppointment(id: string, appointmentId: string) {
    try {
      const dbResponce:IUser | null = await this.storageService.addAppointment(id, appointmentId)
      if (!dbResponce) {
        return { success: false, error: 'User not found' }
      }
      return { success: true, data: dbResponce }
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
