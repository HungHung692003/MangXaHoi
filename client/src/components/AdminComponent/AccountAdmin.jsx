import { useEffect, useState } from 'react'
import SearchBar from './SearchBar'
import { axiosInstance } from '../../axios'
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr'

export default function AccountAdmin() {
  const [user, setUser] = useState([])
  const [filteredUser, setFilteredUser] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchPost, setSearchPost] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' })
  const itemsPerPage = 5

  const fetchAccount = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('admin/getALL')
      const hashtagsData = response.data.result
      setUser(hashtagsData)
      setFilteredUser(hashtagsData)
    } catch (err) {
      setError('Failed to load hashtags', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAccount()
  }, [])

  const handleCreateAdmin = async () => {
    try {
      await axiosInstance.post(`/admin`, {
        password: newAdmin.password,
        username: newAdmin.username,
        email: newAdmin.email
      })
      alert('Admin user created successfully!')
      setNewAdmin({ username: '', password: '', email: '' })
      setModal(false) // Đóng modal
      fetchAccount() // Làm mới danh sách Admin
    } catch {
      setError('Failed to create admin user.')
    }
  }

  const totalPages = Math.ceil(filteredUser.length / itemsPerPage)
  const currentData = filteredUser.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSearch = (searchItem) => {
    const filtered = user.filter((item) => item._id.toLowerCase().includes(searchItem.toLowerCase().trim()))
    setFilteredUser(searchItem.trim() ? filtered : user)
    setCurrentPage(1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  return (
    <div className='flex h-screen gap-3'>
      <div className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
        <h1 className='text-3xl font-bold mb-6 '>Admin User</h1>
        {modal && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-1/4'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Create Admin User</h2>
                <button className='bg-red-500 text-white p-2 rounded-lg' onClick={() => setModal(false)}>
                  Close
                </button>
              </div>
              <div className='flex flex-col gap-4'>
                <input
                  type='text'
                  placeholder='Username'
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  className='border bg-white border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className='border bg-white border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <input
                  type='email'
                  placeholder='Email'
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className='border bg-white border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500'
                />
                <button
                  onClick={handleCreateAdmin}
                  className='bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition'
                >
                  Create Admin
                </button>
                {error && <p className='text-red-500 mt-2'>{error}</p>}
              </div>
            </div>
          </div>
        )}
        {/* Search bar */}
        <div className='flex gap-5'>
          <SearchBar onSearch={handleSearch} />
          <button className='bg-sky-500 text-white p-3 rounded-lg hover:bg-sky-600' onClick={() => setModal(true)}>
            New User
          </button>
        </div>
        {/* Table hiển thị danh sách */}
        <div className='overflow-x-auto'>
          <table className='min-w-full bg-white mt-8 text-left'>
            <thead className=''>
              <tr className='bg-gray-800 text-gray-300'>
                <th className='py-2 pl-3'>Username</th>
                <th className='py-2 pl-3'>Password</th>
                <th className='py-2 '>Email</th>
                <th className='py-2 '>Role</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((user) => (
                  <tr key={user._id}>
                    <td className='py-2 pl-3'>{user.username}</td>
                    <td className='py-2 pl-3'>{user.password}</td>
                    <td className='py-2 '>{user.email}</td>
                    <td className='py-2 '>{user.role}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center py-2 '>
                    No users available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex justify-center items-center mt-6'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-3 mx-2 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'
            } rounded-lg`}
          >
            <GrLinkPrevious />
          </button>
          <span className='p-3'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-3 mx-2 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'
            } rounded-lg`}
          >
            <GrLinkNext />
          </button>
        </div>
      </div>
    </div>
  )
}
