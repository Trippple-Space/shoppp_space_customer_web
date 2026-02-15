import React, { FC, useEffect, useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { IoIosSearch } from 'react-icons/io';
import { productService } from '../../utility/services/product.service';
import { Product } from '../../utility/types/product.interface';
import SearchModal from '../search-modal/SearchModal';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { storeService } from '../../utility/services/store.service';

interface ISearchInput {
  component?: any;
  placeholder?: any;
  storeSlug?: any;
}

const SearchInput: FC<ISearchInput> = ({
  component,
  placeholder,
  storeSlug,
}) => {
  const typePath = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

  const handleOpenSearchModal = () => {
    setOpenSearchModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result =
          component === 'home'
            ? await productService.fetchProductBySearch(searchTerm, {
                filters: {
                  type: typePath === '/fabrics' ? 'fabrics' : 'wears',
                },
              })
            : await productService.fetchProductBySlugSearch(
                storeSlug,
                searchTerm
              );
        setSearchResults(result);

        const storeSearchResults = await storeService.fetchStores(
          {},
          searchTerm
        );
        console.log(storeSearchResults);
      } catch (err) {
        //console.error(err)
      }
    };
    if (searchTerm) {
      fetchProducts();
    }
    if (!openSearchModal || searchTerm === '') {
      setSearchResults([]);
    }
  }, [searchTerm, openSearchModal]);

  return (
    <div
      className={`flex gap-30 l:gap-50 weight-200 text-14 l:text-16 ${
        component === 'home' ? 'l:w-400 md:w-340' : 'l:w-400'
      }`}
    >
      <div
        className={
          component === 'home'
            ? 'flex w-100p relative a-items-center'
            : classNames(
                'relative flex flex-row a-items-center j-content-between flex-grow-1 l:w-full md:w-320',
                {
                  'md:radius-99 md:border md:border-#D9D9D9': !openSearchModal,
                  'md:radius-t-r-9': openSearchModal,
                  'md:radius-t-l-9': openSearchModal,
                  'md:bg-#F3F3F3': openSearchModal,
                }
              )
        }
      >
        <div className="w-full hidden md:block">
          <input
            type="text"
            className={
              component === 'home'
                ? classNames(
                    'hidden flex l:block md:border md:bg-#F3F3F3 md:border-none md:py-12 md:px-14 md:outline-none md:w-100p',
                    {
                      'md:radius-99': !openSearchModal,
                      'md:radius-t-r-9': openSearchModal,
                      'md:radius-t-l-9': openSearchModal,
                    }
                  )
                : 'md:block hidden border-none bg-none outline-none md:w-100p text-16 md:py-11.2 md:pl-14'
            }
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={() => setOpenSearchModal(true)}
          />
        </div>

        <div
          className={
            component === 'home'
              ? classNames(
                  'flex a-items-center j-content-center md:bg-#0B9378 md:absolute r-0 md:m-5 md:cursor-pointer md:w-30 md:h-30 w-100p',
                  {
                    'md:radius-50': !openSearchModal,
                    'md:radius-8': openSearchModal,
                  }
                )
              : 'md:pr-0 pr-20'
          }
        >
          <BiSearch
            className={
              component === 'home'
                ? 'w-20 h-20 color-black md:color-white md:mr-0 mr-10'
                : 'md:w-16 w-24 md:h-16 h-24 md:mb--2 mb--5 md:mr-14'
            }
            onClick={handleOpenSearchModal}
          />
        </div>
        {openSearchModal && (
          <div
            className={classNames(
              'hidden md:block md:absolute md:bg-#f3f3f3 md:w-100p md:h-200 md:bg-#F3F3F3 md:t-35 z-10',
              {
                'md:radius-b-r-9': openSearchModal,
                'md:radius-b-l-9': openSearchModal,
              }
            )}
          >
            <SearchModal searchResults={searchResults} position={'storenav'} />
          </div>
        )}
      </div>
      {openSearchModal && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-70 z-6 md:opacity-0"
            onClick={handleOpenSearchModal}
          />
          <div
            className={`fixed l-50p g|transform:translate(-50%); w-90p h-70 md:w-50p h-60p t-70 mt-30 bg-white z-10 radius-8 pb-20 relative md:mt-0 md:t-60  md:hidden`}
          >
            <div className=" w-100p flex j-content-center md:hidden border-b pb-20 border-b-#00000014">
              <div className="flex j-content-center relative a-items-center mt-20 w-80p">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block radius-99 border bg-#F3F3F3 border-none py-12 px-14 outline-none w-100p"
                  placeholder="Search asoebi.africa"
                />

                <div className="flex j-content-center a-items-center bg-#0B9378 absolute r-0 radius-50 m-5 w-30 h-30">
                  <IoIosSearch
                    className="w-25 h-20 color-#fff"
                    onClick={handleOpenSearchModal}
                  />
                </div>
              </div>
            </div>
            {searchResults.length > 0 && (
              <>
                <SearchModal searchResults={searchResults} position="" />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchInput;
