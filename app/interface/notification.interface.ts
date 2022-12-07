import { User } from '../model/user.model'

export interface INotificationService {
    addNotification(date: Date, user: User,  message: string): void
}