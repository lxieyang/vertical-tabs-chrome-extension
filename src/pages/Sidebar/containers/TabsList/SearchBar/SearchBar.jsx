import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  componentDidMount() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.from === 'background' && request.msg === 'TOGGLE_SIDEBAR') {
        if (request.toStatus) {
          this.searchInput.focus();
        } else {
          this.searchInput.blur();
        }
      }
    });
  }

  render() {
    const {
      searchCount,
      searchBarInputText,
      handleSearchBarInputText,
    } = this.props;

    return (
      <div className="SearchBarContainer">
        <input
          // autoFocus
          ref={(input) => {
            this.searchInput = input;
          }}
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
  }
}

export default SearchBar;
