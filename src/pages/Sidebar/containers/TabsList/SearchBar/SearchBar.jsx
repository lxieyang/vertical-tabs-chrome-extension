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
        type="search"
        className="SearchBarInput"
        placeholder={'🔍 search tabs here'}
        value={searchBarInputText}
        onChange={(e) => handleSearchBarInputText(e)}
      />
      <div className="SearchResultsCountContainer">
        <div
          className={[
            'SearchResultsCount',
            searchBarInputText.length > 0 && searchCount === 0
              ? 'NoResults'
              : null,
            searchBarInputText.length > 0 && searchCount === 1
              ? 'Success'
              : null,
            searchBarInputText.length > 0 && searchCount > 1
              ? 'Searching'
              : null,
            // searchBarInputText.length > 0 && searchCount > 1 && searchCount <= 3
            //   ? 'CloseToSuccess'
            //   : null,
            // searchBarInputText.length > 0 && searchCount > 3
            //   ? 'Searching'
            //   : null,
          ].join(' ')}
        >
          {searchCount}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
