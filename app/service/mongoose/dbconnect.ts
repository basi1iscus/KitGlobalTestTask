import mongoose from 'mongoose'

class DatabaseConnect {
  static _instance: DatabaseConnect
  constructor() {
    if (DatabaseConnect._instance) {
      return DatabaseConnect._instance
    }
    DatabaseConnect._instance = this
    mongoose.set('strictQuery', false)
  }

  async connect(mongoUri:string, databaseName:string) {
    try {
      await mongoose.connect(mongoUri + '/' + databaseName)
      console.log('Mongoose DB connected')
    } catch (error) {
      console.error('Could not connect to Mongoose db', error)
      process.exit(1)
    }
  }
}

export default DatabaseConnect
