import React, { useContext } from 'react';
import classNames from 'classnames';
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
        className={classNames({
          SearchBarInput: true,
          Dark: isDark,
        })}
        placeholder={'🔍 search tabs here'}
        value={searchBarInputText}
        onChange={(e) => handleSearchBarInputText(e)}
      />
      <div className="SearchResultsCountContainer">
        <div
          className={classNames({
            SearchResultsCount: true,
            Dark: isDark,
            NoResults: searchBarInputText.length > 0 && searchCount === 0,
            Success: searchBarInputText.length > 0 && searchCount === 1,
            Searching: searchBarInputText.length > 0 && searchCount > 1,
            // CloseToSuccess:searchBarInputText.length > 0 && searchCount > 1 && searchCount <= 3,
            // Searching: searchBarInputText.length > 0 && searchCount > 3,
          })}
        >
          {searchCount}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
