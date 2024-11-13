import React, { FC, ReactNode } from "react";
import { BiSearch } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

interface ISearchInput {
  inputClassname?: any;
  searchClassname?: any;
  mainSearchClass?: any;
  children: React.ReactNode;
  searchTerm?: any;
  placeholder?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onSearchClick: () => void;
  svgSize?: any;
}

const SearchInput: FC<ISearchInput> = ({
  inputClassname,
  searchClassname,
  mainSearchClass,
  placeholder,
  children,
  searchTerm,
  onChange,
  onClick,
  onSearchClick,
  svgSize,
}) => {
  return (
    <div className={mainSearchClass}>
      <input
        type="text"
        className={inputClassname}
        placeholder={placeholder}
        value={searchTerm}
        onChange={onChange}
        onClick={onClick}
      />
      <div className={searchClassname}>
        <BiSearch className={svgSize} onClick={onSearchClick} />
      </div>
      {children}
    </div>
  );
};

export default SearchInput;
