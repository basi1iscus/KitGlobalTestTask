import express, { Request, Response, NextFunction }  from 'express'
import { validate as uuidValidate } from 'uuid'
import validateSchema from '../middleware/validator'
import { userSchema } from '../schema/user.schema'
import { userController } from '../dep.root'

import checkResponce from '../utils/checkresponce'

const validate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateResult = validateSchema(req.body, userSchema)
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
  const result = await userController.getListHandler()
  res.json(result)
})

router.get('/:id', [validateUUID], async (req: Request, res: Response) => {
  const result = await userController.getHandler(req.params)
  res.status(checkResponce(result))
  res.json(result)
})

router.post('/', [validate], async (req: Request, res: Response) => {
  const result = await userController.createHandler(req.body)
  res.status(checkResponce(result))
  res.json(result)
})

router.delete('/:id', [validateUUID], async (req: Request, res: Response) => {
  const result = await userController.deleteHandler(req.params)
  res.status(checkResponce(result))
  res.json(result)
})

export default router
