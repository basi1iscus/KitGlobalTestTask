import express, { Request, Response, NextFunction } from 'express'

import validateSchema from '../middleware/validator'
import { appointmentSchema } from '../schema/appointment.schema'
import { appointmentController } from '../dependency.root'

import checkResponce from '../utils/checkresponce'

const validate = (req: Request, res: Response, next: NextFunction) => {
  const validateResult = validateSchema(req.body, appointmentSchema)
  if (!validateResult.valid) {
    res.status(400)
    res.json(validateResult.errors)
  } else {
    next()
  }
}

const validateId = (req: Request, res: Response, next: NextFunction) => {
  if (!/^[0-9|a-f]{24,24}$/.test(req.params.id)) {
    res.status(400)
    res.json({ status: 'error', error: 'Invalid id' })
  } else {
    next()
  }
}

const allowedCommand = ['accept', 'reject']
const validateCommand = (req: Request, res: Response, next: NextFunction) => {
  if (!allowedCommand.includes(req.params?.command)) {
    res.status(400)
    res.json({ status: 'error', error: 'Invalid command' })
  } else {
    next()
  }
}

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const result = await appointmentController.getListHandler()
  res.json(result)
})

router.get('/:id', [validateId], async (req: Request, res: Response) => {
  const result = await appointmentController.getHandler(req.params)
  res.status(checkResponce(result))
  res.json(result)
})

router.post('/', [validate], async (req: Request, res: Response) => {
  const result = await appointmentController.createHandler(req.body)
  res.status(checkResponce(result))
  res.json(result)
})

router.post('/:id/:command', [validateId, validateCommand], async (req: Request, res: Response) => {
  let result: any
  if (req.params.command === 'accept') {
    result = await appointmentController.acceptAppointment(req.params)
  } else if (req.params.command === 'reject') {
    result = await appointmentController.rejectAppointment(req.params)
  } else {
    result = { status: 'error', error: 'Invalid command' }
  }
  res.status(checkResponce(result))
  res.json(result)
})

export default router
