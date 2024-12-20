import axios from 'axios'
import { useState, useEffect, useRef } from 'react'

const GIFTKEY = 'QhFpD3YuEywNbWf2U4c4RQpGg9vnDhHX'

export default function ModalGift({ onClose, onSelectGIF }) {
  const [query, setQuery] = useState('')
  const [GiftData, setGiftData] = useState([])
  const modalRef = useRef(null)

  useEffect(() => {
    if (query.trim() === '') return

    const fetchGIFs = async () => {
      try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
          params: {
            api_key: GIFTKEY,
            q: query,
            limit: 5
          }
        })
        console.log('response', response.data)
        setGiftData(response.data.data)
      } catch (error) {
        console.error('Error fetching GIFs:', error)
      }
    }

    const interval = setInterval(() => {
      fetchGIFs()
    }, 2000)

    fetchGIFs()

    return () => {
      clearInterval(interval)
    }
  }, [query])

  const handleSearchGift = (e) => {
    setQuery(e.target.value)
  }

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleGifClick = (gifUrl) => {
    console.log('gifUrl', gifUrl)
    if (onSelectGIF) {
      onSelectGIF(gifUrl) // Truyền URL GIF về cha
    }
    onClose() // Đóng modal sau khi chọn
  }

  return (
    <div className='absolute z-40 bg-gray-200 w-[250px] rounded-lg'>
      <div ref={modalRef}>
        <input
          type='text'
          placeholder='Search for GIFs...'
          onChange={handleSearchGift}
          className='p-2 m-1 rounded border bg-gray-300 text-black'
        />
        <div className='grid grid-cols-3 gap-4 overflow-y-auto'>
          {GiftData.map((gif, index) => (
            <img
              key={index}
              src={gif.images.fixed_height.url}
              alt={gif.title}
              className='w-full rounded cursor-pointer'
              onClick={() => handleGifClick(gif.images.fixed_height.url)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
