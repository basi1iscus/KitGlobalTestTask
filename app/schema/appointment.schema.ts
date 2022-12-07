const appointmentSchema = {
  id: '/Appointment',
  type: 'object',
  properties: {
    date: { type: 'string' },
    user: { type: 'string' },
    doctor: { type: 'string' }
  },
  required: ['date', 'user', 'doctor'],
  additionalProperties: false
}

export { appointmentSchema }
