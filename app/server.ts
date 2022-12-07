import express from 'express'
import userRouter from './route/user'
import appointmentRouter from './route/appointment'
import doctorRouter from './route/doctor'
import config from './config'
import {createDependencies} from './dep.root'

function createServer() {
  const app = express()

  const middleware = [
    express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }),
    express.json({ limit: '50mb' })
  ]

  middleware.forEach((item) => app.use(item))

  app.use(express.json())

  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/doctor', doctorRouter)
  app.use('/api/v1/appointment', appointmentRouter)

  return app
}

function appRun() {
  const port = config.port || 8090

  createDependencies(config)
  const app = createServer()

  app.listen(port, async function () {
    console.log(`Server running on ${port}`)
  })
}

export { createServer, appRun }
