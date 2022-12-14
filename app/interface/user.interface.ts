import { User } from '../model/user.model'

export interface IUserDBService {
  create(data: User): Promise<Partial<User>>
  getList(query?: object): Promise<User[]>
  get(id: string): Promise<User | null>
  update(id: string, data: Partial<User>): Promise<User | null>
  delete(id: string): Promise<User | null>
  findWithFilter(query: object): Promise<User | null>
  addAppointment(id: string, appointmentId: string): Promise<User | null>
}
