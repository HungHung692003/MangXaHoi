import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'
import SearchBar from './SearchBar'
import ResponsiveItemsPerPage from './itemsPerPage'
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr'
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export default function AdminManageAccount() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filteredAccount, setFilteredAccount] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axiosInstance.get('/admin/AccCount')
        setAccounts(response.data.result.data)
        setFilteredAccount(response.data.result.data)
      } catch (error) {
        setError('Failed to load accounts ', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAccounts()
  }, [])
  const handleSearch = (searchTerm) => {
    const filtered = accounts.filter(
      (item) =>
        item.username.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()) ||
        item.email.toLowerCase().trim().includes(searchTerm.toLowerCase().trim())
    )
    setFilteredAccount(searchTerm.trim() ? filtered : accounts)
    setCurrentPage(1)
  }
  const totalPages = Math.ceil(filteredAccount.length / itemsPerPage)
  const currentData = filteredAccount.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }
  return (
    <div className='flex h-full bg-gray-100 gap-3'>
      <ResponsiveItemsPerPage onItemsPerPageChange={setItemsPerPage} />
      <section className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
        <h2 className='text-2xl font-bold mb-4'>Account Management</h2>
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          <table className='min-w-full bg-white text-left mt-8'>
            <thead>
              <tr className='bg-gray-800 text-gray-300'>
                <th className='py-2 pl-3'>ID</th>
                <th className='py-2 '>Username</th>
                <th className='py-2 '>Email</th>
                <th className='py-2 '>Detail</th>
                <th className='py-2 '>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((account) => (
                  <tr key={account._id} className='border hover:bg-slate-300 cursor-pointer'>
                    <td className='py-2 pl-3'>{account._id}</td>
                    <td className='py-2'>{account.username}</td>
                    <td className='py-2'>{account.email}</td>
                    <td className='py-2 '>
                      <button className='bg-blue-100 rounded-[100%] p-4 hover:bg-blue-300'>
                        <FaEdit className=' text-indigo-500' />
                      </button>
                    </td>
                    <td className='py-2 '>
                      <button className='bg-red-100 rounded-full p-4 hover:bg-red-300'>
                        <MdDelete className='text-red-500' />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='text-center py-2'>
                    No accounts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <div className='flex justify-center mt-4'>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 mx-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            <GrLinkPrevious />
          </button>
          <span className='p-2'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 mx-2 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'bg-blue-500 text-white'}`}
          >
            <GrLinkNext />
          </button>
        </div>
      </section>
    </div>
  )
}
