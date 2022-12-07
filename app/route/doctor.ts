import express, { Request, Response, NextFunction }  from 'express'
import { validate as uuidValidate } from 'uuid'

import validateSchema from '../middleware/validator'
import { doctorSchema } from '../schema/doctor.schema'
import { doctorController } from '../dependency.root'

import checkResponce from '../utils/checkresponce'

const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = validateSchema(req.body, doctorSchema)
  if (!validateResult.valid) {
    res.status(400)
    res.json(validateResult.errors)
  } else {
    next()
  }
}

const validateUUID = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!uuidValidate(req.params?.id)) {
    res.status(400)
    res.json({ status: 'error', error: 'Invalid user id' })
  } else {
    next()
  }
}

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const result = await doctorController.getListHandler()
  res.json(result)
})

router.get('/:id', [validateUUID], async (req: Request, res: Response) => {
  const result = await doctorController.getHandler(req.params)
  res.status(checkResponce(result))
  res.json(result)
})

router.post('/', [validate], async (req: Request, res: Response) => {
  const result = await doctorController.createHandler(req.body)
  res.status(checkResponce(result))
  res.json(result)
})

router.delete('/:id', [validateUUID], async (req: Request, res: Response) => {
  const result = await doctorController.deleteHandler(req.params)
  res.status(checkResponce(result))
  res.json(result)
})

export default router
