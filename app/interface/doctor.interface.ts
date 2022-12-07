import { IDoctor, Doctor } from '../model/doctor.model'

export interface IDoctorDBService {
  create(data: Doctor): Promise<IDoctor>
  getList(query?: object): Promise<Doctor[]>
  get(id: string): Promise<Doctor | null>
  update(id: string, data: IDoctor): Promise<Doctor | null>
  delete(id: string): Promise<Doctor | null>
  findWithFilter(query: object): Promise<Doctor | null>
  addAppointment(id: string, appointmentId: string): Promise<Doctor | null>
}
