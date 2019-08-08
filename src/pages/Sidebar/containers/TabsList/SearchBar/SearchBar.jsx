import React from 'react';
import './SearchBar.css';

const SearchBar = ({
  searchCount,
  searchBarInputText,
  handleSearchBarInputText,
}) => {
  return (
    <div className="SearchBarContainer">
      <input
        className="SearchBarInput"
        placeholder={'🔍 search tabs here'}
        value={searchBarInputText}
        onChange={(e) => handleSearchBarInputText(e)}
      />
      <div className="SearchResultsCount">{searchCount}</div>
    </div>
  );
};

export default SearchBar;
