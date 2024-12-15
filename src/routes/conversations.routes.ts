import { Router } from 'express'
import {
  accessTokenValidatetor,
  getConversationsValidator,
  verifiedUserValidator
} from '../middlewares/users.middlewares'
import { getConversationsController, getthongbao } from '../controllers/conversations.controllers'
import { paginationValidator } from '../middlewares/tweets.middlewares'
import { wrapRequestHandler } from '../../utils/handlerl'

const conversationsRouter = Router()

conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidatetor,
  verifiedUserValidator,
  paginationValidator,
  getConversationsValidator,
  wrapRequestHandler(getConversationsController)
)
conversationsRouter.get('/get', accessTokenValidatetor, verifiedUserValidator, wrapRequestHandler(getthongbao))
export default conversationsRouter
