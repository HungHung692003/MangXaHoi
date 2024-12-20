import { Router } from 'express'
import { accessTokenValidatetor, verifiedUserValidator } from '../middlewares/users.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'
import {
  createNotification,
  getNotificationsByOwner,
  updateNotification
} from '../controllers/Notifications.controllers'

const notifications = Router()

notifications.post(
  '/createNotification',
  accessTokenValidatetor,
  verifiedUserValidator,
  wrapRequestHandler(createNotification)
)
notifications.get('/notifications', accessTokenValidatetor, wrapRequestHandler(getNotificationsByOwner))
export default notifications
notifications.put('/notifications/:notificationId', wrapRequestHandler(updateNotification))
