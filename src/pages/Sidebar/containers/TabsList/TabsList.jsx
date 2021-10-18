import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import DarkModeContext from '../../context/dark-mode-context';

import { MdAdd } from 'react-icons/md';

import SearchBar from './SearchBar/SearchBar';
import Tab from './Tab/Tab';
import './react-contextmenu.css';

import './TabsList.css';

const TabsList = ({
  tabOrders,
  tabsDict,
  activeTab,
  displayTabInFull,
  moveTab,
  setTabAsLoading,
}) => {
  let firstTab = null;

  const [searchBarInputText, _setSearchBarInputText] = useState('');
  const [contextMenuShow, _setContextMenuShow] = useState(false);
  const [contextMenuShowPrev, _setContextMenuShowPrev] = useState(null);
  const [platformInfo, _setPlatformInfo] = useState(null);

  const setContextMenuShow = (toStatus) => {
    if (toStatus === false) {
      _setContextMenuShow(false);
      _setContextMenuShowPrev(true);
    }
  };

  const clearContextMenuShow = () => {
    _setContextMenuShow(false);
    _setContextMenuShowPrev(null);
  };

  const keyPressHandler = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        // enter key
        if (searchBarInputText.length > 0) {
          if (firstTab) {
            chrome.tabs.update(firstTab.id, { active: true });
            clearSearchBoxInputText();
          }
        }
      }
    },
    [searchBarInputText, firstTab]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPressHandler, false);

    chrome.runtime.getPlatformInfo((info) => {
      _setPlatformInfo(info);
    });

    return () => {
      document.removeEventListener('keydown', keyPressHandler, false);
    };
  }, [keyPressHandler]);

  const handleSearchBarInputText = (event) => {
    let inputText = event.target.value;
    _setSearchBarInputText(inputText);
  };

  const clearSearchBoxInputText = () => {
    _setSearchBarInputText('');
  };

  const openNewTabClickedHandler = (e) => {
    chrome.tabs.create({});
  };

  const renderTab = (tabOrder, idx) => {
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
        activeTab={activeTab}
        displayTabInFull={displayTabInFull}
        contextMenuShow={contextMenuShow}
        contextMenuShowPrev={contextMenuShowPrev}
        moveTab={moveTab}
        setTabAsLoading={setTabAsLoading}
        clearSearchBoxInputText={clearSearchBoxInputText}
        isSearching={searchBarInputText.length > 0}
        setContextMenuShow={setContextMenuShow}
        clearContextMenuShow={clearContextMenuShow}
        openNewTabClickedHandler={openNewTabClickedHandler}
      />
    );
  };

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
    firstTab = tabOrdersCopy[0];
  } else {
    firstTab = null;
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
              handleSearchBarInputText={handleSearchBarInputText}
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
                      <React.Fragment key={tabOrder.id}>
                        {renderTab(tabOrder, idx)}
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
                  <React.Fragment key={tabOrder.id}>
                    {renderTab(tabOrder, idx + pinnedTabs.length)}
                  </React.Fragment>
                );
              })}

              <div className="PinnedUnpinnedDivider"></div>

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
                  onClick={(e) => openNewTabClickedHandler(e)}
                >
                  <MdAdd size={'22px'} style={{ marginRight: 3 }} />
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
};

export default TabsList;
