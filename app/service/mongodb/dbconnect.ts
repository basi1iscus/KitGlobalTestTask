import { MongoClient, Db } from 'mongodb'

class DatabaseConnect {
  static _instance: DatabaseConnect
  client: MongoClient | null = null
  database: Db | null = null
  constructor() {
    if (DatabaseConnect._instance) {
      return DatabaseConnect._instance
    }
    DatabaseConnect._instance = this
  }

  async connect(mongoUri:string, databaseName:string) {
    try {
      this.client = new MongoClient(mongoUri)
      await this.client.connect()
      this.database = this.client.db(databaseName)
      console.log('MongoDB DB connected')
    } catch (error) {
      console.error('Could not connect to MongoDB db', error)
      if (this.client) {
        this.client.close()
      }
      process.exit(1)
    }
  }
}

export default DatabaseConnect
