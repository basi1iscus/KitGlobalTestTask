const doctorSchema = {
  id: '/Doctor',
  type: 'object',
  properties: {
    email: { type: 'string' },
    reg_token: { type: 'string' },
    photo_avatar: { type: 'string' },
    phone: { type: 'string' },
    name: { type: 'string' },
    lastName: { type: 'string' },
    spec: { type: 'string' }
  },
  required: ['email', 'name', 'spec'],
  additionalProperties: false
}

export { doctorSchema }
