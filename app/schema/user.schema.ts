const userSchema = {
  id: '/User',
  type: 'object',
  properties: {
    email: { type: 'string' },
    reg_token: { type: 'string' },
    photo_avatar: { type: 'string' },
    phone: { type: 'string' },
    name: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['email', 'name'],
  additionalProperties: false
}

export { userSchema }
