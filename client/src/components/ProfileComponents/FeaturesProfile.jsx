import { useEffect, useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import { axiosInstance } from '../../axios'
import { useAuth } from '../../store'

export default function FeaturesProfile({ reiceiverId }) {
  console.log('reiceiverId', reiceiverId)
  const { user } = useAuth()
  const [Follow, setFollow] = useState(false)
  const [listUser, setListUser] = useState([])
  const fetchListUser = async () => {
    const res = await axiosInstance.get(`/api/followers/${user._id}`)
    setListUser(res.data.result)
  }
  const handleFollow = async () => {
    const isFollowed = listUser.some((user) => user._id === reiceiverId)
    isFollowed
      ? await axiosInstance.delete(`/api/follow/${reiceiverId}`)
      : await axiosInstance.post('/api/follow/', { followed_user_ids: reiceiverId })
    setFollow((prevFollow) => !prevFollow)
    await fetchListUser()
  }
  useEffect(() => {
    fetchListUser()
  }, [])
  useEffect(() => {
    const isFollowed = listUser.some((user) => user._id === reiceiverId)
    setFollow(isFollowed)
  }, [listUser, reiceiverId])
  return (
    <div className='absolute flex gap-2 top-[52%] right-4'>
      <div className='relative flex flex-col items-center'>
        <button className='p-2 rounded-full border border-gray-400'>
          <FaEnvelope className='w-[25px] h-[25px] text-sky-500  cursor-pointer' />
        </button>
        <span className='absolute top-10 right-0 px-1 bg-red-500 text-black text-xs opacity-0 invisible transition-opacity duration-200'>
          Message
        </span>
      </div>
      <div>
        <button
          className='px-5 py-3 rounded-full font-bold text-base border border-gray-400 leading-5 text-black hover:bg-[#d3d3d3]'
          onClick={() => handleFollow()}
        >
          {Follow ? 'Unfollow' : 'Follow'}
        </button>
      </div>
    </div>
  )
}
