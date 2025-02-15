import { ObjectId } from 'mongodb'

interface ConversationType {
  _id?: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  created_at?: Date
  updated_at?: Date
  is_read?: boolean
}

export default class Conversation {
  _id: ObjectId
  sender_id: ObjectId
  receiver_id: ObjectId
  content: string
  is_read: boolean
  created_at?: Date
  updated_at?: Date

  constructor({ _id, sender_id, receiver_id, content, created_at, updated_at, is_read = false }: ConversationType) {
    const date = new Date()
    this._id = _id || new ObjectId()
    this.sender_id = sender_id
    this.receiver_id = receiver_id
    this.content = content
    this.is_read = is_read
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
