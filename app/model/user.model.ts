import { Appointment } from './appointment.model'

export class User {
  id = ''
  email = ''
  reg_token = ''
  photo_avatar = ''
  phone = ''
  name = ''
  type = 'user'
  appointments: Appointment[] = []

  constructor(userData: Partial<User>) {
    const copyField = <T extends object>(k: keyof T, target: T, source: T) => {
      target[k] = source[k]
    }
    for (const key in userData) {
      const keyName = key as keyof User
      if (keyName in this) {
        copyField(keyName, this, userData)
      }
    }
  }
}
