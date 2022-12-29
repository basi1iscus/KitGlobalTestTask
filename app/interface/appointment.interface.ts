import { Appointment } from '../model/appointment.model'

export interface IAppointmentDBService {
  create(data: Appointment): Promise<Partial<Appointment>>
  getList(query?: object): Promise<Appointment[]>
  get(id: string): Promise<Appointment | null>
  update(id: string, data: Partial<Appointment>): Promise<Appointment | null>
  delete(id: string): Promise<Appointment | null>
  findWithFilter(query: object): Promise<Appointment | null>
  getCount(query: object): Promise<number>
}
