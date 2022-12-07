import mongoose from 'mongoose'
import { v4 } from 'uuid'
import { IUser, User } from '../../model/user.model'
import { IUserDBService } from '../../interface/user.interface'

const UserSchema = new mongoose.Schema({
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
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Appointments'
    }
  ]
})

class UserMongodbService implements IUserDBService {
  UserModel = mongoose.model('Users', UserSchema)

  async create(userData: User): Promise<IUser> {
    try {
      const user = await this.UserModel.create(userData)
      return { id: user._id.toString() }
    } catch (error: any) {
      throw new Error(typeof error === 'object' && error ? error.message : 'Unknown error')
    }
  }

  async getList(query: object = {}): Promise<User[]> {
    const cursor = this.UserModel.find(query)
    return cursor
      .then((arr) => arr.map((user) => new User(user.toJSON({ virtuals: true }))))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async get(userID: string): Promise<User | null> {
    return this.UserModel.findById(userID)
      .then((data) => (data ? new User(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async findWithFilter(filter: IUser): Promise<User | null> {
    return this.UserModel.findOne(filter)
      .then((data) => (data ? new User(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async update(userID: string, userData: IUser): Promise<User | null> {
    return this.UserModel.findByIdAndUpdate(userID, userData, {
      returnDocument: 'after'
    })
      .then((data) => (data ? new User(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async addAppointment(id: string, appointmentId: string): Promise<User | null> {
    return this.UserModel.findOneAndUpdate(
      { _id: id, appointments: { $nin: [appointmentId] } },
      { $push: { appointments: appointmentId } },
      { returnDocument: 'after' }
    )
      .then((data) => (data ? new User(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }

  async delete(userID: string): Promise<User | null> {
    return this.UserModel.findByIdAndDelete(userID)
      .then((data) => (data ? new User(data.toJSON({ virtuals: true })) : null))
      .catch((error) => {
        throw Error(String(error.message))
      })
  }
}

export default UserMongodbService
