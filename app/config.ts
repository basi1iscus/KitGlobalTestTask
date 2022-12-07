import dotenv from 'dotenv'

dotenv.config()

const options = {
  port: process.env.PORT,
  app: process.env.APP,
  env: process.env.NODE_ENV,
  storageService: 'mongoose',
  mongoUri: process.env.MONGO_URI,
  databaseName: process.env.DATABASE_NAME,
  notificationPath: __dirname + 'notification.txt'
}

export default options
