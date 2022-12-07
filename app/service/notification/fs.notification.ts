import schedule from 'node-schedule'
import fs from 'fs/promises'

import { User } from '../../model/user.model'
import { INotificationService } from '../../interface/notification.interface'

export class FSNotificationService implements INotificationService {
    filename: string
    constructor(filename: string) {
        this.filename = filename
    }
    
    addNotification(date: Date, user: User, message: string): void {
        const job = schedule.scheduleJob(date, () => {
            fs.appendFile(
                this.filename,
                message,
                { encoding: 'utf8' }
            )
        })
    }
}
