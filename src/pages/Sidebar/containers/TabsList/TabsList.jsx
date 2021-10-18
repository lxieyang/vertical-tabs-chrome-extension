import React, { Component } from 'react';
import classNames from 'classnames';
import DarkModeContext from '../../context/dark-mode-context';

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

    platformInfo: null,
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

    chrome.runtime.getPlatformInfo((info) => {
      this.setState({
        platformInfo: info,
      });
    });
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

  renderTab = (tabOrder, idx) => {
    return (
      <Tab
        key={tabOrder.id}
        idx={idx}
        id={tabOrder.id}
        index={tabOrder.index}
        active={tabOrder.active}
        pinned={tabOrder.pinned}
        mutedInfo={tabOrder.mutedInfo}
        openerTabId={tabOrder.openerTabId}
        audible={tabOrder.audible}
        faviconUrl={tabOrder.faviconUrl}
        title={tabOrder.title}
        url={tabOrder.url}
        status={tabOrder.status}
        activeTab={this.props.activeTab}
        displayTabInFull={this.props.displayTabInFull}
        contextMenuShow={this.state.contextMenuShow}
        contextMenuShowPrev={this.state.contextMenuShowPrev}
        moveTab={this.props.moveTab}
        setTabAsLoading={this.props.setTabAsLoading}
        clearSearchBoxInputText={this.clearSearchBoxInputText}
        isSearching={this.state.searchBarInputText.length > 0}
        setContextMenuShow={this.setContextMenuShow}
        clearContextMenuShow={this.clearContextMenuShow}
        openNewTabClickedHandler={this.openNewTabClickedHandler}
      />
    );
  };

  render() {
    const { tabOrders, tabsDict } = this.props;
    const { searchBarInputText, platformInfo } = this.state;

    const inputText = searchBarInputText.toLowerCase();

    const tabOrdersCopy = [];
    tabOrders.forEach((tabOrder) => {
      const { id } = tabOrder;
      if (tabsDict[id] !== undefined) {
        const { combinedText } = tabsDict[id];
        if (combinedText.includes(inputText)) {
          tabOrdersCopy.push({
            ...tabOrder,
            ...tabsDict[id],
          });
        }
      }
    });

    if (tabOrdersCopy.length > 0) {
      this.firstTab = tabOrdersCopy[0];
    } else {
      this.firstTab = null;
    }

    const pinnedTabs = tabOrdersCopy.filter((item) => item.pinned);
    const unpinnedTabs = tabOrdersCopy.filter((item) => !item.pinned);

    return (
      <DarkModeContext.Consumer>
        {({ isDark }) => {
          return (
            <div style={{ margin: 0, padding: '48px 0px 0px 0px' }}>
              <SearchBar
                searchBarInputText={searchBarInputText}
                handleSearchBarInputText={this.handleSearchBarInputText}
                searchCount={tabOrdersCopy.length}
              />

              <div style={{ margin: 0, padding: 0 }}>
                {pinnedTabs.length > 0 && (
                  <div className="PinnedTabsContainer">
                    {pinnedTabs.map((tabOrder, idx) => {
                      if (tabsDict[tabOrder.id] === undefined) {
                        return null;
                      }

                      // let tab = { ...tabsDict[tabOrder.id] };
                      return (
                        <React.Fragment key={idx}>
                          {this.renderTab(tabOrder, idx)}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}

                {pinnedTabs.length > 0 && unpinnedTabs.length > 0 && (
                  <div className="PinnedUnpinnedDivider"></div>
                )}

                {unpinnedTabs.map((tabOrder, idx) => {
                  if (tabsDict[tabOrder.id] === undefined) {
                    return null;
                  }

                  // let tab = { ...tabsDict[tabOrder.id] };
                  return (
                    <React.Fragment key={idx}>
                      {this.renderTab(tabOrder, idx + pinnedTabs.length)}
                    </React.Fragment>
                  );
                })}

                <div
                  className={classNames({
                    NewTabButtonContainer: true,
                    Dark: isDark,
                  })}
                  title="Open a new tab"
                >
                  <div
                    className={classNames({
                      NewTabButton: true,
                      Dark: isDark,
                    })}
                    onClick={(e) => this.openNewTabClickedHandler(e)}
                  >
                    <MdAdd size={'24px'} style={{ marginRight: 5 }} />
                    New Tab
                    <div style={{ flex: 1 }}></div>
                    {platformInfo && platformInfo.os && (
                      <div className="ShortcutName">
                        {platformInfo.os === 'mac' ? `⌘T` : `Ctrl+T`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </DarkModeContext.Consumer>
    );
  }
}

export default TabsList;
