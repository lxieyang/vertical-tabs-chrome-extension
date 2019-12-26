import React, { useEffect, useRef, useContext } from 'react';
import DarkModeContext from '../../../context/dark-mode-context';
import './SearchBar.css';

const SearchBar = ({
  searchCount,
  searchBarInputText,
  handleSearchBarInputText,
}) => {
  const darkModeContext = useContext(DarkModeContext);
  const { isDark } = darkModeContext;

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.from === 'background' && request.msg === 'TOGGLE_SIDEBAR') {
        if (request.toStatus) {
          this.searchInput.focus();
        } else {
          this.searchInput.blur();
        }
      }
    });
  }, []);

  let inputRef = useRef(null);

  return (
    <div className="SearchBarContainer">
      <input
        // autoFocus
        ref={(input) => {
          inputRef = input;
        }}
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
