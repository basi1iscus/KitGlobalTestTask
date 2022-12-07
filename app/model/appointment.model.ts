import { User } from './user.model'
import { Doctor } from './doctor.model'

export interface IAppointment {
  id?: string
  date?: Date
  user?: string | User
  doctor?: string | Doctor
  active?: boolean
}

export class Appointment implements IAppointment{
  id: string = ''
  date: Date = new Date()
  user: string | User = ''
  doctor: string | Doctor = ''
  active: boolean = false
  
  constructor (appointmentData: IAppointment) {
    const copyField = < T extends {} > (k: keyof T, target: T, source: T) => {
      target[k] = source[k];
    }    
    for (const key in appointmentData) {
      const keyName = key as keyof IAppointment;
      if (keyName in this) {
        copyField(keyName, this, appointmentData)
      }
    }
   }
  }
