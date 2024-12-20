import { EncodingStatus } from '../../constants/enums'
import { ObjectId } from 'mongodb'

interface VideoStatusType {
  _id?: ObjectId
  name: string
  status: EncodingStatus
  message?: string
  created_at?: Date
  updated_at?: Date
}

export default class VideoStatus {
  _id?: ObjectId
  name: string
  status: EncodingStatus
  message: string
  created_at: Date
  updated_at: Date

  constructor({ name, status, _id, created_at, message, updated_at }: VideoStatusType) {
    const date = new Date()
    this._id = _id
    this.name = name
    this.status = status
    this.message = message || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}