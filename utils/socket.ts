import { Socket } from 'socket.io'
import { UserVerifyStatus } from '../src/constants/enums'
import HTTP_STATUS from '../src/constants/httpStatus'
import { USERS_MESSAGES } from '../src/constants/Messager'
import { ErrorWithStatus } from '../src/models/Errors'
import { TokenPayload } from './../src/models/requests/Users.Requests'
import { verifyAccessToken } from './commons'
import { ObjectId } from 'mongodb'
import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'
import databaseService from '../src/services/database.services'
import Conversation from '../src/models/schemas/Conversations.schema'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN // Địa chỉ của client
    }
  })
  const users: { [key: string]: { socket_id: string; peer_id: string } } = {}
  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]
    try {
      const decoded_authorization = await verifyAccessToken(access_token)
      const { verify } = decoded_authorization as TokenPayload

      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middleware khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token

      next()
    } catch (error) {
      next({
        message: 'Không được phép',
        name: 'Lỗi không được phép',
        data: error
      })
    }
  })
  io.on('connection', (socket: Socket) => {
    console.log(`User ${socket.id} connected`)
    const { user_id, peer_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = { socket_id: socket.id, peer_id: peer_id }
    socket.on('getNotifications', (data) => {
      console.log('data', data)
      const { user_id } = data
      io.to(users[user_id].socket_id).emit('getNotifications', {
        user_id
      })
    })
    socket.on('getMess', (data) => {
      const { receiver_id } = data
      console.log('user', users)
      console.log('data', receiver_id)
      io.to(users[receiver_id]?.socket_id).emit('notiMessage', {
        receiver_id
      })
    })
    socket.on('send_message', async (data) => {
      const { sender_id, receiver_id, content } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id
      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id),
        receiver_id: new ObjectId(receiver_id),
        content
      })
      const result = await databaseService.conversations.insertOne(conversation)
      conversation._id = result.insertedId
      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receive_message', { payload: conversation })
      }
    })

    socket.on('register_peer', (data) => {
      console.log('register_peer ', data)
      const { peer_id, receiver_id, sender_id } = data
      if (users[receiver_id]) {
        users[receiver_id].peer_id = peer_id
        console.log(`User ${receiver_id} đã đăng ký với Peer ID ${peer_id}`)
      }
    })
    socket.on('start_call', (data) => {
      console.log('data', data)
      console.log('users', users)
      const { socket_id, peer_id, receiver_id, sender_id } = data
      const receiver = users[receiver_id]
      if (receiver) {
        io.to(receiver.socket_id).emit('incoming_call', {
          peer_id,
          socket_id: socket.id,
          receiver_id,
          sender_id
        })
        console.log('Call started from', sender_id, 'to', receiver_id)
      } else {
        io.to(socket.id).emit('call_error', { message: 'Người nhận không khả dụng.' })
      }
    })
    socket.on('accept_call', (data) => {
      console.log('users', users)
      const { socket_id, peer_id, receiver_id, sender_id } = data
      const receiver = users[receiver_id]
      const sender = users[sender_id]
      if (receiver) {
        io.to(receiver.socket_id).emit('call_accepted', { receiver_id, receiver_socket_id: socket.id, sender_id })
        io.to(sender.socket_id).emit('call_accepted', {
          receiver_id,
          receiver_socket_id: receiver.socket_id,
          sender_id
        })
        console.log('Call accepted by', receiver_id)
      }
    })
    socket.on('reject_call', (data) => {
      console.log('data reject_call ', data)
      const { socket_id, peer_id, receiver_id, sender_id } = data
      const sender = users[receiver_id]
      if (sender) {
        io.to(sender.socket_id).emit('call_rejected', { receiver_id })
        console.log(`Cuộc gọi từ ${sender_id} đã bị từ chối bởi ${receiver_id}`)
      } else {
        console.error(`Không thể tìm thấy người gọi ${sender_id}`)
      }
    })
    socket.on('end_call', (data) => {
      console.log('end call ', data)
      const { sender_id, receiver_id } = data
      const receiver = users[receiver_id]
      const sender = users[sender_id]
      if (receiver) {
        io.to(receiver.socket_id).emit('call_ended', { sender_id })
      }
    })
    socket.on('disconnect', () => {
      const userId = Object.keys(users).find((key) => users[key].socket_id === socket.id)
      if (userId) {
        delete users[userId]
        console.log(`User ${userId} disconnected`)
      }
    })
  })
}
export default initSocket
