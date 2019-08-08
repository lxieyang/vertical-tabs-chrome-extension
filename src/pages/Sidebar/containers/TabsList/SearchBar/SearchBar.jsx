import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchCount }) => {
  return (
    <div className="SearchBarContainer">
      <input className="SearchBarInput" placeholder={'🔍 search tabs here'} />
      <div className="SearchResultsCount">{searchCount}</div>
    </div>
  );
};

export default SearchBar;
