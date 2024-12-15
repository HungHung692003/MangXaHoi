import { useEffect } from 'react'

export default function ResponsiveItemsPerPage({ onItemsPerPageChange }) {
  useEffect(() => {
    const updateItemsPerPage = () => {
      const items = window.innerWidth >= 1200 ? 10 : onItemsPerPageChange(items)
    }
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)

    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [onItemsPerPageChange])

  return null
}
