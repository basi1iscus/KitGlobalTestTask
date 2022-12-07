import mongodb from 'mongodb'
import { ObjectId } from 'bson'
import { IUser, User } from '../../models/user.model'
import { IUserDBService } from '../../interface/user.interfece'

class UserMongodbService implements IUserDBService {
  databaseConnect: mongodb.Db
  collection: mongodb.Collection
  
  constructor(databaseConnect: mongodb.Db) {
    this.databaseConnect = databaseConnect
    this.collection = this.databaseConnect.collection('users')
  }

  async createUser(userData: User): Promise<IUser> {
    try {
      const user = await this.collection.insertOne(userData)
      return { userId: user.insertedId.toString() }
    } catch (error: any) {
      throw new Error(typeof error === 'object' && error ? error.errmsg : 'Unknown error')
    }
  }

  async getUsersList(query: object = {}): Promise<User[]> {
    const cursor = this.collection.find(query) 
    return cursor
      .toArray()
      .then((arr) => arr.map((user) => new User({ ...user, userId: user._id.toString() })))
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async getUser(userID: string): Promise<User | null> {
    const _id:ObjectId = new ObjectId(userID)
    return this.collection
      .findOne({ _id: new ObjectId(userID) })
      .then((data)=> data ? new User({ ...data, userId: data._id.toString() }) : null)
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async findUserWithFilter(filter: IUser): Promise<User | null> {
    return this.collection
      .findOne(filter)
      .then((data) => data ? new User({ ...data, userId: data._id.toString() }) : null)
      .catch((error) => { throw Error(String(error.errmsg)) })
  }

  async updateUser(userID: string, userData: IUser): Promise<User | null> {
    return this.collection
      .findOneAndUpdate(
        { _id: new ObjectId(userID) },
        { $set: userData },
        { returnDocument: 'after' }
      )
      .then((data) => data.value ? new User({ ...data.value, userId: data.value._id.toString() }) : null )
      .catch((error) => { throw Error(String(error.errmsg)) })
  }
  
  async deleteUser(userID: string): Promise<User | null> {
    return this.collection
      .findOneAndDelete({ _id: new ObjectId(userID) })
      .then((data) => data.value ? new User({ ...data.value, userId: data.value._id.toString() }) : null )
      .catch((error) => { throw Error(String(error.errmsg)) })
  }
 
}

export default UserMongodbService
