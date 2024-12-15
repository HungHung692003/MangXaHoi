import { useCallback, useEffect, useRef, useState } from 'react'
import { axiosInstance } from '../../axios'
import socket from '../../socket'
import { FaRegPaperPlane } from 'react-icons/fa'
import { useAuth } from '../../store'
import { IoMdArrowRoundBack } from 'react-icons/io'
const LIMIT = 10
export default function MessageChat({ selectedUser, setSelectedUser }) {
  const { user } = useAuth()
  const reiveiverId = selectedUser.id
  const [chat, setChat] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [newMessage, setNewMessage] = useState([])
  const messagesEndRef = useRef(null)
  const messageListRef = useRef(null)

  useEffect(() => {
    setChat([])
    setPage(1)
    setHasMore(true)
    fetchMessages()
  }, [reiveiverId])

  const fetchMessages = useCallback(async () => {
    if (!reiveiverId) return
    try {
      const response = await axiosInstance.get(`/conversations/receivers/${reiveiverId}`, {
        params: { limit: LIMIT, page }
      })
      const newMessages = response.data.result.conversations
      if (newMessages.length < LIMIT) setHasMore(false)
      setChat((prev) => [...newMessages.reverse(), ...prev])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      scrollToBottom()
    }
  }, [reiveiverId, page])

  useEffect(() => {
    const handleMessageReceived = (payload) => {
      const newMessage = {
        content: payload.payload.content,
        timestamp: new Date().toLocaleString(),
        sender_id: payload.payload.sender_id
      }
      setChat((prev) => [...prev, newMessage])
      scrollToBottom()
    }
    socket.on('receive_message', handleMessageReceived)
    return () => {
      socket.off('receive_message', handleMessageReceived)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [chat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = useCallback(
    async (e) => {
      e.preventDefault()
      if (!newMessage.trim()) return
      const timestamp = new Date().toLocaleString()
      const conversation = {
        content: newMessage,
        sender_id: user._id,
        receiver_id: reiveiverId,
        sender_name: user.name,
        _id: new Date().getTime().toString(),
        timestamp
      }
      console.log('reiveiverId', reiveiverId)
      socket.emit('send_message', { payload: conversation })
      socket.emit('getMess', { receiver_id: reiveiverId })
      setChat((prev) => [...prev, conversation])
      setNewMessage('')
      scrollToBottom()
    },
    [newMessage, user._id, reiveiverId, user.name]
  )

  const handleScroll = () => {
    if (messageListRef.current && messageListRef.current.scrollTop === 0) {
      if (hasMore) {
        setPage((prevPage) => prevPage + 1)
      }
    }
  }
  const handleBack = (selectedUser) => {
    setSelectedUser(null)
    console.log(selectedUser)
  }
  return (
    <div className='flex h-[90%] flex-col '>
      <div className='flex items-center gap-2.5 p-3 border-b border-gray-600'>
        <IoMdArrowRoundBack
          className='w-[40px] h-[40px] text-black cursor-pointer p-2 hover:bg-gray-300'
          onClick={() => handleBack(selectedUser)}
        />
        <img
          src={selectedUser.avatar || './images/iconavatar.jpg'}
          alt='avatar'
          className='w-[40px] h-[40px] object-cover rounded-full'
        />
        <h1 className='text-2xl font-semibold text-black'>{selectedUser.name}</h1>
      </div>
      <div
        className='flex-1 h-[250px] overflow-y-auto p-2 scrollbar-chatbox'
        ref={messageListRef}
        onScroll={handleScroll}
      >
        {chat.length > 0 ? (
          chat.map((conversation, index) => (
            <div
              key={conversation._id || index}
              className={`flex ${conversation.sender_id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`${
                  conversation.sender_id === user._id ? 'bg-blue-500' : 'bg-gray-700'
                } text-white p-3 my-1 rounded-2xl max-w-[80%] break-words`}
              >
                <p className='text-base rounded-s-full'>{conversation.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className='text-center text-black text-xl'>Không có tin nhắn nào!</p>
        )}
      </div>
      <div className='flex items-center justify-between p-2 bg-gray-800 text-white rounded-b-xl'>
        <input
          type='text'
          placeholder='Nhắn tin ...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className='w-full px-4 py-2 text-white  '
        />
        <button onClick={handleSendMessage} className='text-xl ml-2 text-blue-500'>
          <FaRegPaperPlane />
        </button>
      </div>
    </div>
  )
}
