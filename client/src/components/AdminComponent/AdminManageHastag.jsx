import { useEffect, useState } from 'react'
import { axiosInstance } from '../../axios'
import SearchBar from './SearchBar' // Import SearchBar component
import ResponsiveItemsPerPage from './itemsPerPage'
import { MdDelete } from 'react-icons/md'
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr'

export default function AdminManageHashtag() {
  const [hashtag, setHashtag] = useState([])
  const [filteredHashtag, setFilteredHashtag] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newHashtags, setNewHashtags] = useState('')
  const [creating, setCreating] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const [create, setCreate] = useState(false)
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const response = await axiosInstance.get('admin/HashTag')
        const hashtagsData = response.data.result.result
        setHashtag(hashtagsData)
        setFilteredHashtag(hashtagsData)
      } catch (err) {
        setError('Failed to load hashtags', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHashtags()
  }, [])

  const handleSearch = (searchTerm) => {
    const filtered = hashtag.filter((item) => item._id.toLowerCase().trim().includes(searchTerm.toLowerCase().trim()))

    setFilteredHashtag(searchTerm.trim() ? filtered : hashtag)
    setCurrentPage(1)
  }

  const handleCreateHashtags = async (e) => {
    e.preventDefault()
    const hashtagsArray = newHashtags.split(',').map((hashtag) => hashtag.trim())
    if (hashtagsArray.length === 0 || hashtagsArray.some((hashtag) => !hashtag)) {
      alert('Hashtags cannot be empty or invalid')
      return
    }
    setCreating(true)
    setCreate(false)
    try {
      await axiosInstance.post('/admin/CreateHashTag', { name: hashtagsArray })
      const response = await axiosInstance.get('admin/HashTag')
      setHashtag(response.data.result.result)
      setFilteredHashtag(response.data.result.result)
      setNewHashtags('')
      setCurrentPage(1)
    } catch (err) {
      alert('Failed to create hashtags', err)
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteHashtag = async (hashtagID) => {
    try {
      await axiosInstance.delete(`/admin/deleteHashTag/${hashtagID}`)
      setHashtag((prevHashtags) => prevHashtags.filter((hashtag) => hashtag._id !== hashtagID))
      setFilteredHashtag((prevHashtags) => prevHashtags.filter((hashtag) => hashtag._id !== hashtagID))
    } catch (err) {
      alert('Failed to delete hashtag', err)
    }
  }

  const totalPages = Math.ceil(filteredHashtag.length / itemsPerPage)
  const currentData = filteredHashtag.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error}</p>

  return (
    <div className='flex h-screen  gap-3'>
      <ResponsiveItemsPerPage onItemsPerPageChange={setItemsPerPage} />
      <section className='w-full bg-gray-100 p-6 rounded-lg shadow-lg text-black'>
        <h2 className='text-2xl font-bold mb-4'>Hashtag Management</h2>
        <div className='flex justify-between  items-center'>
          <SearchBar onSearch={handleSearch} />
          <button
            className='bg-sky-500 hover:bg-sky-600'
            onClick={() => {
              setCreate(true)
            }}
          >
            Create Hastag
          </button>
        </div>
        <div className='flex gap-40 mt-8'>
          <div className='flex mt-4 w-full'>
            <table className='min-w-full bg-white text-left'>
              <thead>
                <tr className='bg-gray-800 text-gray-300'>
                  <th className='py-2 pl-3'>ID</th>
                  <th className='py-2 '>Name Hashtag</th>
                  <th className='py-2 '>Created at</th>
                  <th className='py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((account) => (
                    <tr key={account._id} className='border hover:bg-slate-300 cursor-pointer'>
                      <td className='py-2 pl-3'>{account._id}</td>
                      <td className='py-2 '>{account.name}</td>
                      <td className='py-2 '>{account.created_at}</td>
                      <td className='py-2 '>
                        <button
                          className='bg-red-100 rounded-full p-4 hover:bg-red-300'
                          onClick={() => handleDeleteHashtag(account._id)}
                        >
                          <MdDelete className='text-red-500' />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='4' className='text-center py-2 '>
                      No hashtags available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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

        {create && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
            <div className='bg-white rounded-lg shadow-lg p-6 w-1/4'>
              <form onSubmit={handleCreateHashtags} className='flex flex-col gap-2 bg-white'>
                <div className='flex justify-between items-center mb-4'>
                  <label className='font-bold text-lg'>Create New Hashtags:</label>
                  <button
                    className='text-white bg-red-500'
                    onClick={() => {
                      setCreate(false)
                    }}
                  >
                    Close
                  </button>
                </div>
                <input
                  type='text'
                  value={newHashtags}
                  onChange={(e) => setNewHashtags(e.target.value)}
                  placeholder='#Hastag'
                  className='py-2  bg-white'
                  required
                />
                <button
                  type='submit'
                  disabled={creating}
                  className={`mt-2 p-2 bg-blue-500 text-white ${creating ? 'opacity-50' : ''}`}
                >
                  {creating ? 'Creating...' : 'Create Hashtags'}
                </button>
              </form>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
