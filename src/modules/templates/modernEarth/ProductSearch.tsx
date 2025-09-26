import React, { useEffect, useRef, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { toast } from 'sonner'
import SearchModal from '@/modules/lib/components/search-modal/SearchModal'
import { productService } from '@/modules/lib/utility/services/product.service'
import type { Product } from '@/modules/lib/utility/types/product.interface'
import { IoIosSearch } from 'react-icons/io'

interface ModernEarthSearchProps {
  storeSlug: string
}

export const ModernEarthSearch: React.FC<ModernEarthSearchProps> = ({ storeSlug }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [openSearchModal, setOpenSearchModal] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleOpenSearchModal = () => setOpenSearchModal(prev => !prev)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenSearchModal(false)
      }
    }
    if (openSearchModal) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openSearchModal])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.fetchProductBySlugSearch(storeSlug, searchTerm)
        setSearchResults(result)
      } catch {
        toast.error('Error fetching search results')
      }
    }

    if (searchTerm) {
      fetchProducts()
    }
    if (!openSearchModal || searchTerm === '') {
      setSearchResults([])
    }
  }, [searchTerm, openSearchModal, storeSlug])

  return (
    <>
      <div ref={containerRef} className="modernEarth__search bg-white flex items-center w-full">
        <input
          type="text"
          placeholder="Search product..."
          className="h-42 w-full px-3 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onClick={() => setOpenSearchModal(true)}
        />
        <TbSearch
          className="w-24 h-24 min-w-24 bg-transparent mr-10 cursor-pointer"
          onClick={handleOpenSearchModal}
        />

        {openSearchModal && (
            <div
                className="hidden block absolute min-w-200 max-w-400 h-300 bg-white border border-#00000014 radius-4 t-44 z-10 modernEarth_searchIcon"                    >
                <SearchModal searchResults={searchResults} position={'storenav'} />
            </div>
        )}
      </div>
    </>
  )
}