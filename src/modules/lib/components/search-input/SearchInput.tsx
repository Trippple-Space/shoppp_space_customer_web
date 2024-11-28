import React, { FC, useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";
import { productService } from "../../utility/services/product.service";
import { Product } from "../../utility/types/product.interface";
import SearchModal from "../search-modal/SearchModal";
import classNames from "classnames";

interface ISearchInput {
  component?: any;
  placeholder?: any;
}

const SearchInput: FC<ISearchInput> = ({
  component,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const [openSearchModal, setOpenSearchModal] = useState<boolean>(false);

  const handleOpenSearchModal = () => {
    setOpenSearchModal((prev) => !prev);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.fetchProductBySearch(searchTerm);
        setSearchResults(result);
      } catch (err) {
        console.error(err);
      }
    };
    if (searchTerm) {
      fetchProducts();
    }
  }, [searchTerm]);

  return (
    <div className="flex gap-30 l:gap-50 weight-200 text-14 l:text-16 l:w-400">
      <div
        className={
          component === "home"
            ? "flex w-100p relative"
            : classNames(
                "relative flex flex-row a-items-center j-content-between flex-grow-1 l:w-full md:w-320",
                {
                  "md:radius-99 md:border md:border-#D9D9D9": !openSearchModal,
                  "md:radius-t-r-9": openSearchModal,
                  "md:radius-t-l-9": openSearchModal,
                  "md:bg-#F3F3F3": openSearchModal,
                }
              )
        }
      >
        <input
          type="text"
          className={
            component === "home"
              ? classNames(
                  "hidden flex l:block l:border l:bg-#F3F3F3 l:border-none l:py-12 l:px-14 l:outline-none l:w-100p",
                  {
                    "l:radius-99": !openSearchModal,
                    "l:radius-t-r-9": openSearchModal,
                    "l:radius-t-l-9": openSearchModal,
                  }
                )
              : "md:block hidden border-none bg-none outline-none md:w-100p text-16 md:py-11.2 md:pl-14"
          }
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setOpenSearchModal(true)}
        />
        <div
          className={
            component === "home"
              ? classNames(
                  "flex a-items-center j-content-center l:bg-#0B9378 l:absolute r-0 l:m-5 l:cursor-pointer l:w-30 l:h-30 w-100p",
                  {
                    "l:radius-50": !openSearchModal,
                    "l:radius-8": openSearchModal,
                  }
                )
              : "md:pr-0 pr-20"
          }
        >
          <BiSearch className={component === 'home' ? 'w-25 h-20 color-black l:color-white' : 'md:w-16 w-24 md:h-16 h-24 md:mb--2 mb--5 md:mr-14'} onClick={handleOpenSearchModal} />
        </div>
        {openSearchModal && (
          <div
            className={classNames(
              "hidden l:block l:absolute l:bg-#f3f3f3 l:w-100p l:h-200 l:bg-#F3F3F3 l:t-35 z-10",
              {
                "l:radius-b-r-9": openSearchModal,
                "l:radius-b-l-9": openSearchModal,
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
            className="fixed inset-0 bg-black opacity-70 z-6 l:opacity-0"
            onClick={handleOpenSearchModal}
          />
          <div className={`fixed l-50p g|transform:translate(-50%); w-90p h-70 l:w-50p h-60p t-70 mt-30 bg-white z-10 radius-8 pb-20 relative l:mt-0 l:t-60  l:hidden`}>
            <div className=" w-100p flex j-content-center l:hidden border-b pb-20 border-b-#00000014">
              <div className="flex  j-content-center relative a-items-center mt-20 w-80p">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block radius-99 border bg-#F3F3F3 border-none py-12 px-14  outline-none w-100p"
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
              <SearchModal searchResults={searchResults} position="" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchInput;
