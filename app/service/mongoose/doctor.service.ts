import mongoose from 'mongoose'
import { v4 } from 'uuid'
import { Doctor } from '../../model/doctor.model'
import { IDoctorDBService } from '../../interface/doctor.interface'

const DoctorSchema = new mongoose.Schema({
  _id: { type: String, required: true, default: v4 },
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
  appointments_accepted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointments'
    }
  ]
})

class DoctorMongodbService implements IDoctorDBService {
  DoctorModel = mongoose.model('Doctors', DoctorSchema)

  async create(DoctorData: Doctor): Promise<Partial<Doctor>> {
    try {
      const doctor = await this.DoctorModel.create(DoctorData)
      return { id: doctor._id.toString() }
    } catch (error: any) {
      throw new Error(typeof error === 'object' && error ? error.message : 'Unknown error')
    }
  }

  async getList(query: object = {}): Promise<Doctor[]> {
    const cursor = this.DoctorModel.find(query)
    return cursor
      .then((arr) => arr.map((doctor) => new Doctor(doctor.toJSON({ virtuals: true }))))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async get(id: string): Promise<Doctor | null> {
    return this.DoctorModel.findById(id)
      .then((data) => (data ? new Doctor(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async findWithFilter(filter: Partial<Doctor>): Promise<Doctor | null> {
    return this.DoctorModel.findOne(filter)
      .then((data) => (data ? new Doctor(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async update(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
    return this.DoctorModel.findByIdAndUpdate(id, data, {
      returnDocument: 'after'
    })
      .then((data) => (data ? new Doctor(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async addAppointment(id: string, appointmentId: string): Promise<Doctor | null> {
    return this.DoctorModel.findOneAndUpdate(
      { _id: id, appointments_accepted: { $nin: [appointmentId] } },
      { $push: { appointments_accepted: appointmentId } },
      { returnDocument: 'after' }
    )
      .then((data) => (data ? new Doctor(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async delete(id: string): Promise<Doctor | null> {
    return this.DoctorModel.findByIdAndDelete(id)
      .then((data) => (data ? new Doctor(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }
}

export default DoctorMongodbService
