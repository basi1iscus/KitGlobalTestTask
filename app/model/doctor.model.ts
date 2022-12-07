import { Appointment } from './appointment.model'

export interface IDoctor {
  id?: string
  email?: string
  reg_token?: string
  photo_avatar?: string
  phone?: string
  name?: string
  type?: string
  spec?: string
  free?: boolean
  appointments_accepted?: Appointment[]
}

export class Doctor implements IDoctor{
  id: string = ''
  email: string = ''
  reg_token: string = ''
  photo_avatar: string = ''
  phone: string = ''
  name: string = ''
  type: string = 'doc'
  spec: string = ''
  free: boolean = true
  appointments_accepted: Appointment[] = []
  
  constructor (doctorData: IDoctor) {
    const copyField = < T extends {} > (k: keyof T, target: T, source: T) => {
      target[k] = source[k];
    }    
    for (const key in doctorData) {
      const keyName = key as keyof IDoctor;
      if (keyName in this) {
        copyField(keyName, this, doctorData)
      }
    }
   }
  }
