import React, { FC, ReactNode } from "react";
import { IoIosSearch } from "react-icons/io";

interface ISearchInput {
  inputClassname?: any;
  searchClassname?: any;
  mainSearchClass?: any;
  children: React.ReactNode;
  searchTerm?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onSearchClick: () => void;
}

const SearchInput: FC<ISearchInput> = ({
  inputClassname,
  searchClassname,
  mainSearchClass,
  children,
  searchTerm,
  onChange,
  onClick,
  onSearchClick,
}) => {
  return (
    <div className={mainSearchClass}>
      <input
        type="text"
        className={inputClassname}
        placeholder="Search asoebi.africa"
        value={searchTerm}
        onChange={onChange}
        onClick={onClick}
      />
      <div className={searchClassname}>
        <IoIosSearch
          className="sm:w-25 w-24 sm:h-20 h-24"
          onClick={onSearchClick}
        />
      </div>
      {children}
    </div>
  );
};

export default SearchInput;
