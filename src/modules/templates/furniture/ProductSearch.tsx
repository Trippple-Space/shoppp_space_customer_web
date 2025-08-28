import SearchModal from '@/modules/lib/components/search-modal/SearchModal'
import { productService } from '@/modules/lib/utility/services/product.service'
import { Product } from '@/modules/lib/utility/types/product.interface'
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { toast } from 'sonner'

export const ProductSearch = ({ storeSlug }: { storeSlug: string }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<Product[]>([])

    const [openSearchModal, setOpenSearchModal] = useState<boolean>(false)

    const handleOpenSearchModal = () => {
        setOpenSearchModal(prev => !prev)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await productService.fetchProductBySlugSearch(storeSlug, searchTerm)
                setSearchResults(result)
            } catch (err) {
                toast.error('Error fetching search results')
            }
        }
        if (searchTerm) {
            fetchProducts()
        }
        if (!openSearchModal || searchTerm === '') {
            setSearchResults([])
        }
    }, [searchTerm, openSearchModal])

    return (
        <>
            <div id="search-box" className="furniture-flex relative">
                <img className='img' src="/images/furniture/icons/search.png" alt="search-icon" onClick={handleOpenSearchModal} />
                <img className='img' src="/images/furniture/icons/search-black.svg" alt="search-icon" onClick={handleOpenSearchModal} />
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Product Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onClick={() => setOpenSearchModal(true)}
                />

                {openSearchModal && (
                    <div
                        className="hidden md:block md:absolute md:w-100p min-w-200 md:h-200 md:bg-white md:border md:border-#00000014 radius-4 md:t-43 z-10"                    >
                        <SearchModal searchResults={searchResults} position={'storenav'} />
                    </div>
                )}
            </div>


            {openSearchModal && (
                <>
                    <div
                        className='fixed inset-0 bg-black opacity-70 z-6 md:opacity-0'
                        onClick={handleOpenSearchModal}
                    />
                    <div
                        className={`fixed l-50p g|transform:translate(-50%); w-90p h-70 md:w-50p h-60p t-70 mt-30 bg-white z-10 radius-8 pb-20 relative md:mt-0 md:t-60  md:hidden`}
                    >
                        <div className=' w-100p flex j-content-center md:hidden border-b pb-20 border-b-#00000014'>
                            <div className='flex j-content-center relative a-items-center mt-20 w-80p'>
                                <input
                                    type='text'
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className='block radius-99 border bg-#F3F3F3 border-none py-12 px-14 outline-none w-100p'
                                    placeholder='Search asoebi.africa'
                                />

                                <div className='flex j-content-center a-items-center bg-#0B9378 absolute r-0 radius-50 m-5 w-30 h-30'>
                                    <IoIosSearch
                                        className='w-25 h-20 color-#fff'
                                        onClick={handleOpenSearchModal}
                                    />
                                </div>
                            </div>
                        </div>
                        {searchResults.length > 0 && (
                            <>
                                <SearchModal searchResults={searchResults} position='' />
                            </>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
