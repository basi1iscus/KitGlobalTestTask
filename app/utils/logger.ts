import logger from 'pino'

import { ILogger } from '../interface/logger.interface'

export class PinoLogger implements ILogger {
  log
  constructor() {
    this.log = logger({
      base: undefined,
      timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
    })
  }

  info(message: string): void {
    this.log.info(message)
  }
  error(message: string): void {
    this.log.error(message)
  }
  warning(message: string): void {
    this.log.warn(message)
  }
}
