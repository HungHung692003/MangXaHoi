import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { axiosInstance } from '../../axios'

export default function MessageSearch({ setSearch, userList, onClickMessage }) {
  const [input, setInput] = useState('')
  const [listUser, setListUser] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  useEffect(() => {
    const fetchListUser = async () => {
      const res = await axiosInstance.get('/api/listUsers')
      setListUser(res.data.result)
    }
    fetchListUser()
  }, [])
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers([])
      return
    }
    const filtered = listUser.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase().trim()))
    setFilteredUsers(filtered)
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setInput(value)
    handleSearch(value)
  }
  const handleClick = (user) => {
    onClickMessage(user._id, user.name, user.avatar)
    setSearch(false)
  }
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg shadow-lg w-1/3 min-h-96'>
        <div className='text-black flex justify-between p-3 items-center'>
          <h2 className='text-black font-semibold text-2xl'>Search Message</h2>
          <button
            className='rounded-full w-9 h-9 hover:bg-gray-300 flex items-center justify-center p-2 text-lg'
            onClick={() => setSearch(false)}
          >
            X
          </button>
        </div>
        <div className='p-3'>
          <div className='flex items-center gap-2 p-2 bg-gray-300 rounded-lg'>
            <FaSearch className='text-gray-500 text-xl' />
            <input
              type='text'
              value={input}
              onChange={handleInputChange}
              className='text-black w-full bg-gray-300 outline-none placeholder-gray-500'
              placeholder='Search...'
            />
          </div>
        </div>

        {/* Search Results */}
        <div className='p-3'>
          {filteredUsers.length > 0 ? (
            <ul className='space-y-2'>
              {filteredUsers.map((user) => (
                <li
                  key={user._id}
                  className='flex gap-2.5 items-center p-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-black transition cursor-pointer'
                  onClick={() => {
                    handleClick(user)
                  }}
                >
                  <img
                    src={user.avatar || 'images/iconavatar.jpg'}
                    alt=''
                    className='w-[40px] h-[40px] rounded-full object-cover'
                  />
                  <div>
                    <p className='text-lg font-semibold'>{user.name}</p>
                    <p>{user.handle}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-black text-center text-xl'>User not found</p>
          )}
        </div>
      </div>
    </div>
  )
}
