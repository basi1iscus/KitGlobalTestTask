import { Appointment } from './appointment.model'

export interface IUser {
  id?: string
  email?: string
  reg_token?: string
  photo_avatar?: string
  phone?: string
  name?: string
  type?: string
  appointments?: Appointment[]
}

export class User implements IUser{
  id: string = ''
  email: string = ''
  reg_token: string = ''
  photo_avatar: string = ''
  phone: string = ''
  name: string = ''
  type: string = 'user'
  appointments: Appointment[] = []
  
  constructor (userData: IUser) {
    const copyField = < T extends {} > (k: keyof T, target: T, source: T) => {
      target[k] = source[k];
    }    
    for (const key in userData) {
      const keyName = key as keyof IUser;
      if (keyName in this) {
        copyField(keyName, this, userData)
      }
    }
   }
  }
