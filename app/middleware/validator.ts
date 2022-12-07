import { Validator } from 'jsonschema'

const validateSchema = (data: any, schema: any) => {
  const validator = new Validator()
  const result = validator.validate(data, schema)
  return result
}

export default validateSchema
