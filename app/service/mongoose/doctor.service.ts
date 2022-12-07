import mongoose from 'mongoose'
import { v4 } from 'uuid'
import { IDoctor, Doctor } from '../../model/doctor.model'
import { IDoctorDBService } from '../../interface/doctor.interface'

const DoctorSchema = new mongoose.Schema( {
    _id: { type: String, default: v4, alias: 'id' },
    email: {
      type: String,
      required: true,
      unique: true
    },
    reg_token: { type: String },
    photo_avatar: { type: String },
    phone: { type: String },
    name: { type: String, required: true },
    type: { type: String },
    spec: { type: String },
    free: { type: Boolean },
    appointments_accepted: [ {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Appointments'} ]
  })

class DoctorMongodbService implements IDoctorDBService {
  DoctorModel = mongoose.model("Doctors", DoctorSchema);

  constructor() {
  }

  async create(DoctorData: Doctor): Promise<IDoctor> {
    try {
      const doctor = await this.DoctorModel.create(DoctorData)
      return { id: doctor._id.toString() }
    } catch (error: any) {
      throw new Error(typeof error === 'object' && error ? error.errmsg : 'Unknown error')
    }
  }

  async getList(query: object = {}): Promise<Doctor[]> {
    const cursor = this.DoctorModel.find(query) 
    return cursor
      .then((arr) => arr.map((doctor) => new Doctor(doctor.toJSON({ virtuals: true }))))
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async get(id: string): Promise<Doctor | null> {
    return this.DoctorModel
      .findById(id)
      .then((data)=> data ? new Doctor(data.toJSON({ virtuals: true })) : null)
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async findWithFilter(filter: IDoctor): Promise<Doctor | null> {
    return this.DoctorModel
      .findOne(filter)
      .then((data) => data ? new Doctor(data.toJSON({ virtuals: true })) : null)
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async update(id: string, data: IDoctor): Promise<Doctor | null> {
    return this.DoctorModel
      .findByIdAndUpdate(id, data, { returnDocument: 'after' })
      .then((data) => data ? new Doctor(data.toJSON({ virtuals: true })) : null )
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async addAppointment(id: string, appointmentId: string): Promise<Doctor | null> {
    return this.DoctorModel
      .findOneAndUpdate({ _id: id, appointments_accepted:  {$nin: [appointmentId]} }, { $push: { appointments_accepted: appointmentId } }, { returnDocument: 'after' })
      .then((data) => data ? new Doctor(data.toJSON({ virtuals: true })) : null )
      .catch((error) => { throw Error(String(error.errmsg)) })
  }
  
  async delete(id: string): Promise<Doctor | null> {
    return this.DoctorModel
      .findByIdAndDelete(id)
      .then((data) => data ? new Doctor(data.toJSON({ virtuals: true })) : null )
      .catch((error) => { throw Error(String(error.errmsg)) })
  }
 
}

export default DoctorMongodbService
