import { Appointment } from './appointment.model'
export class Doctor {
  id = ''
  email = ''
  reg_token = ''
  photo_avatar = ''
  phone = ''
  name = ''
  type = 'doc'
  spec = ''
  free = true
  appointments_accepted: Appointment[] = []

  constructor(doctorData: Partial<Doctor>) {
    const copyField = <T extends object>(k: keyof T, target: T, source: T) => {
      target[k] = source[k]
    }
    for (const key in doctorData) {
      const keyName = key as keyof Doctor
      if (keyName in this) {
        copyField(keyName, this, doctorData)
      }
    }
  }
}
