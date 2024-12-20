import { IoIosLogOut } from 'react-icons/io'
import { useAuth } from '../../store'
import { useNavigate } from 'react-router-dom'
import { axiosInstance } from '../../axios'

function ProfileButton() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  return (
    <div className='flex flex-col xl:flex-row cursor-pointer overflow-hidden gap-5 px-2.5 2xl:py-4 py-3 w-full '>
      <div className='flex items-center gap-2.5 '>
        <img
          loading='lazy'
          src={user?.avatar || './images/iconavatar.jpg'}
          alt=''
          className='object-cover shrink-0 aspect-square rounded-[99999px] w-[30px] h-[30px] '
        />
        <div className='flex flex-col display-none-xl'>
          <div className='text-base self-start font-bold text-neutral-900'>{user?.name}</div>
          {user?.username && (
            <div className='font-medium tracking-tight text-slate-500 text-lg'>@ {user?.username}</div>
          )}
        </div>
      </div>
      <button className='p-0'>
        <IoIosLogOut
          onClick={() => {
            axiosInstance
              .post('/api/logout', {
                refresh_token: localStorage.getItem('refregh_token')
              })
              .then((res) => {
                console.log(res)

                setUser(null)
                localStorage.removeItem('access_token')
                navigate('/login')
              })
              .catch((error) => {
                console.log('errer', error)
              })
          }}
          className='mt-2.5 text-black h-[30px] w-[30px] cursor-pointer hover:bg-gray-200 '
        />
      </button>
    </div>
  )
}

export default ProfileButton
