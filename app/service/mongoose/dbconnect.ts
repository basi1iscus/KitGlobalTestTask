import mongoose from 'mongoose'
import { log } from '../../dependency.root'

class DatabaseConnect {
  static _instance: DatabaseConnect
  constructor() {
    if (DatabaseConnect._instance) {
      return DatabaseConnect._instance
    }
    DatabaseConnect._instance = this
    mongoose.set('strictQuery', false)
  }

  async connect(mongoUri: string) {
    try {
      await mongoose.connect(mongoUri)
      log.info('Mongoose DB connected')
    } catch (error: any) {
      log.error('Could not connect to Mongoose db' + error.message)
      process.exit(1)
    }
  }
}

export default DatabaseConnect
