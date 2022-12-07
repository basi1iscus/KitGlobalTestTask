import mongoose from 'mongoose'
import { IAppointment, Appointment } from '../../model/appointment.model'
import { IAppointmentDBService } from '../../interface/appointment.interface'

const AppointmentSchema = new mongoose.Schema( {
    _id: { type: mongoose.Schema.Types.ObjectId, alias: 'id' },
    date: {
      type: Date,
      required: true,
    },
    user: {type: String, required: true, ref: 'User'},
    doctor: {type: String, required: true, ref: 'Doctor'},
    active: { type: Boolean }
  })

class AppointmentMongodbService implements IAppointmentDBService {
  AppointmentModel = mongoose.model("Appointments", AppointmentSchema);

  constructor() {
  }

  async create(appointmentsData: Appointment): Promise<IAppointment> {
    try {
      const Appointment = await this.AppointmentModel.create(appointmentsData)
      return { id: Appointment._id.toString() }
    } catch (error: any) {
      throw new Error(typeof error === 'object' && error ? error.message : 'Unknown error')
    }
  }

  async getList(query: object = {}): Promise<Appointment[]> {
    const cursor = this.AppointmentModel.find(query) 
    return cursor
      .then((arr) => arr.map((appointment) => new Appointment(appointment.toJSON({ virtuals: true }))))
      .catch((error) => { throw Error(String(error.message)) })
  }

  async getCount(query: object = {}): Promise<number> {
    const cursor = this.AppointmentModel.find(query).count()
    return cursor
      .then((count: number) => count)
      .catch((error) => { throw Error(String(error.message)) })
  }

  async get(id: string): Promise<Appointment | null> {
    return this.AppointmentModel
      .findById(id)
      .then((data: any)=> data ? new Appointment(data.toJSON({ virtuals: true })) : null)
      .catch((error: any) => { throw Error(String(error.message)) })
  }

  async findWithFilter(filter: IAppointment): Promise<Appointment | null> {
    return this.AppointmentModel
      .findOne(filter)
      .then((data) => data ? new Appointment(data.toJSON({ virtuals: true })) : null)
      .catch((error) => { throw Error(String(error.message)) })
  }

  async update(id: string, data: IAppointment): Promise<Appointment | null> {
    return this.AppointmentModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .then((data) => data ? new Appointment(data.toJSON({ virtuals: true })) : null )
      .catch((error) => { throw Error(String(error.message)) })
  }
  
  async delete(id: string): Promise<Appointment | null> {
    return this.AppointmentModel
      .findByIdAndDelete(id)
      .then((data) => data ? new Appointment(data.toJSON({ virtuals: true })) : null )
      .catch((error) => { throw Error(String(error.message)) })
  }
 
}

export default AppointmentMongodbService
