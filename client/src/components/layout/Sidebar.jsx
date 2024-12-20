import NavItem from './NavItem'
import ProfileButton from './ProfileButton'
import { MdOutlinePostAdd } from 'react-icons/md'

const navItems = [
  { icon: '/images/home-icon.svg', text: 'Home', isActive: true, navigate: '/home' },
  { icon: '/images/explore-icon.svg', text: 'Explore', navigate: '/search' },
  { icon: '/images/notifications-icon.svg', text: 'Notifications' },
  { icon: '/images/messages-icon.svg', text: 'Messages', navigate: '/message' },
  { icon: '/images/bookmarks-icon.svg', text: 'Bookmarks', navigate: '/bookmark' },
  { icon: '/images/profile-icon.svg', text: 'Profile', navigate: '/profile' }
]

function Sidebar() {
  return (
    <nav className='flex flex-col mt-3 max-w-full text-xl font-bold whitespace-nowrap text-neutral-900 xl:w-[275px] w-[40px]'>
      <div className='fixed top-1'>
        <a href='/home' className='flex  2xl:py-4 py-3 w-full items-center'>
          <img loading='lazy' src='/images/VA.svg' alt='Twitter Logo' className='object-contain w-[55px]' />
          <p className='text-2xl text-sky-500 hidden xl:block '>VAsocial Media</p>
        </a>
        {navItems.map((item, index) => (
          <NavItem
            key={index}
            icon={item.icon}
            text={item.text}
            isActive={item.isActive}
            navigate={item.navigate}
            count={item.count || 0}
          />
        ))}
        <ProfileButton />
      </div>
    </nav>
  )
}

export default Sidebar
