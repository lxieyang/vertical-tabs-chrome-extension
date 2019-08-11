import React, { Component } from 'react';

import { MdAdd } from 'react-icons/md';

import SearchBar from './SearchBar/SearchBar';
import Tab from './Tab/Tab';
import './react-contextmenu.css';

import './TabsList.css';

class TabsList extends Component {
  state = {
    searchBarInputText: '',
    contextMenuShow: false,
    contextMenuShowPrev: null,
  };

  setContextMenuShow = (toStatus) => {
    if (toStatus === false) {
      this.setState({
        contextMenuShow: false,
        contextMenuShowPrev: true,
      });
    }
  };

  clearContextMenuShow = () => {
    this.setState({
      contextMenuShow: false,
      contextMenuShowPrev: null,
    });
  };

  constructor(props) {
    super(props);
    this.keyPressListener = this.keyPressHandler.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyPressListener, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPressListener, false);
  }

  keyPressHandler(event) {
    if (event.keyCode === 13) {
      // enter key
      if (this.state.searchBarInputText.length > 0) {
        if (this.firstTab) {
          chrome.tabs.update(this.firstTab.id, { active: true });
          this.clearSearchBoxInputText();
        }
      }
    }
  }

  handleSearchBarInputText = (event) => {
    let inputText = event.target.value;
    this.setState({
      searchBarInputText: inputText,
    });
  };

  clearSearchBoxInputText = () => {
    this.setState({ searchBarInputText: '' });
  };

  openNewTabClickedHandler = (e) => {
    chrome.tabs.create({});
  };

  render() {
    const { tabOrders, activeTab, tabsDict, moveTab } = this.props;
    const {
      searchBarInputText,
      contextMenuShow,
      contextMenuShowPrev,
    } = this.state;

    const inputText = searchBarInputText.toLowerCase();

    const tabOrdersCopy = [];
    tabOrders.forEach((tabOrder) => {
      const { id, index, active, pinned } = tabOrder;
      if (tabsDict[id] !== undefined) {
        const { faviconUrl, title, url, combinedText } = tabsDict[id];
        if (combinedText.includes(inputText)) {
          tabOrdersCopy.push({
            id,
            index,
            active,
            pinned,
            faviconUrl,
            title,
            url,
            combinedText,
          });
        }
      }
    });

    if (tabOrdersCopy.length > 0) {
      this.firstTab = tabOrdersCopy[0];
    } else {
      this.firstTab = null;
    }

    return (
      <div style={{ margin: 0, padding: '48px 0px 0px 0px' }}>
        <SearchBar
          searchBarInputText={searchBarInputText}
          handleSearchBarInputText={this.handleSearchBarInputText}
          searchCount={tabOrdersCopy.length}
        />

        <ul style={{ margin: 0, padding: 0 }}>
          {tabOrdersCopy.map((tabOrder, idx) => {
            if (tabsDict[tabOrder.id] === undefined) {
              return null;
            }

            // let tab = { ...tabsDict[tabOrder.id] };
            return (
              <Tab
                key={tabOrder.id}
                idx={idx}
                id={tabOrder.id}
                index={tabOrder.index}
                active={tabOrder.active}
                pinned={tabOrder.pinned}
                faviconUrl={tabOrder.faviconUrl}
                title={tabOrder.title}
                url={tabOrder.url}
                activeTab={activeTab}
                contextMenuShow={contextMenuShow}
                contextMenuShowPrev={contextMenuShowPrev}
                moveTab={moveTab}
                clearSearchBoxInputText={this.clearSearchBoxInputText}
                isSearching={searchBarInputText.length > 0}
                setContextMenuShow={this.setContextMenuShow}
                clearContextMenuShow={this.clearContextMenuShow}
                openNewTabClickedHandler={this.openNewTabClickedHandler}
              />
            );
          })}

          <li className="NewTabButtonContainer" title="Open a new tab">
            <div
              className="NewTabButton"
              onClick={(e) => this.openNewTabClickedHandler(e)}
            >
              <MdAdd size={'22px'} />
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default TabsList;
