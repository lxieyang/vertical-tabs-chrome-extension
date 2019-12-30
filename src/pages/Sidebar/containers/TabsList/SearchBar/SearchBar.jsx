import React, { useContext } from 'react';
import DarkModeContext from '../../../context/dark-mode-context';
import './SearchBar.css';

const SearchBar = ({
  searchCount,
  searchBarInputText,
  handleSearchBarInputText,
}) => {
  const darkModeContext = useContext(DarkModeContext);
  const { isDark } = darkModeContext;

  return (
    <div className="SearchBarContainer">
      <input
        // autoFocus
        type="search"
        className={['SearchBarInput', isDark ? 'Dark' : null].join(' ')}
        placeholder={'🔍 search tabs here'}
        value={searchBarInputText}
        onChange={(e) => handleSearchBarInputText(e)}
      />
      <div className="SearchResultsCountContainer">
        <div
          className={[
            'SearchResultsCount',
            isDark ? 'Dark' : null,
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
