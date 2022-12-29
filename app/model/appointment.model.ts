import { User } from './user.model'
import { Doctor } from './doctor.model'

export class Appointment {
  id = ''
  date: Date = new Date()
  user: string | User = ''
  doctor: string | Doctor = ''
  active = false

  constructor(appointmentData: Partial<Appointment>) {
    const copyField = <T extends object>(k: keyof T, target: T, source: T) => {
      target[k] = source[k]
    }
    for (const key in appointmentData) {
      const keyName = key as keyof Appointment
      if (keyName in this) {
        copyField(keyName, this, appointmentData)
      }
    }
  }
}
