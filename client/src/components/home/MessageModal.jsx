import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'
import { FaAngleDoubleDown, FaAngleDoubleUp } from 'react-icons/fa'
import MessageChat from './MessageChat'

export default function MessageModal() {
  const [isCollapsed, setIsCollapsed] = useState(false) // state để theo dõi trạng thái của hộp
  const [selectedUser, setSelectedUser] = useState(null) // state để lưu người dùng đã chọn

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const [userList, setUserList] = useState([])
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/api/followers/$')
        const users = res.data.result.map((user) => ({
          id: user._id,
          name: user.username,
          avatar: user.avatar,
          handle: '@' + user.username,
          hasUnread: false
        }))
        setUserList(users)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
  }, [])

  const handleClick = (user) => {
    setSelectedUser(user) // Lưu người dùng đã chọn
  }

  return (
    <div
      className={`w-[400px] h-[530px]  bg-gray-100 rounded-lg shadow-gray-500 shadow-lg border fixed bottom-0 right-3 z-50 transition ease-in-out delay-150 duration-300 ${isCollapsed ? 'translate-y-0 ' : '  -translate-y-[-90%]'}`}
    >
      <div className='flex justify-between p-3 items-center'>
        <h1 className='text-black text-2xl font-medium'>Message</h1>
        <div onClick={toggleCollapse}>
          {isCollapsed ? (
            <FaAngleDoubleDown className='text-black text-xl cursor-pointer' />
          ) : (
            <FaAngleDoubleUp className='text-black text-xl cursor-pointer' />
          )}
        </div>
      </div>
      {selectedUser === null ? (
        <div>
          {userList.length > 0 ? (
            userList.map((user) => (
              <div
                key={user.id}
                className='flex gap-5 p-3 items-center hover:bg-gray-200 cursor-pointer'
                onClick={() => handleClick(user)}
              >
                <img
                  src={user.avatar || './images/iconavatar.jpg'}
                  alt={`${user.name}'s avatar`}
                  className='w-[40px] h-[40px] rounded-full object-contain'
                />
                <div className='flex items-center gap-2'>
                  <p className='text-black font-medium text-lg'>{user.name}</p>
                  {user.hasUnread && <span className='text-red-500 text-sm'>Unread messages</span>}
                </div>
              </div>
            ))
          ) : (
            <p className='text-[#71767b]'>No users found.</p>
          )}
        </div>
      ) : (
        <MessageChat selectedUser={selectedUser} setSelectedUser={setSelectedUser} isCollapsed={isCollapsed} />
      )}
    </div>
  )
}
