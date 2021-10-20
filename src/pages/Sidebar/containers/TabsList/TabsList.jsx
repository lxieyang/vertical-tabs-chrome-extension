import React, { useState, useEffect, useCallback, memo } from 'react';
import classNames from 'classnames';
import { useDrop } from 'react-dnd';
import ItemTypes from './ItemTypes';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import DarkModeContext from '../../context/dark-mode-context';
import { usePrevious } from '../../../../shared/utils';

import { MdAdd } from 'react-icons/md';

import SearchBar from './SearchBar/SearchBar';
import Tab from './Tab/Tab';
import './react-contextmenu.css';

import './TabsList.css';

const TabsList = ({
  tabOrders,
  activeTab,
  displayTabInFull,
  displayTabPreviewFrame,
  setTabAsLoading,
}) => {
  const [, drop] = useDrop(() => ({ accept: ItemTypes.TABCARD }));

  const [searchBarInputText, _setSearchBarInputText] = useState('');
  const [contextMenuShow, _setContextMenuShow] = useState(false);
  const [contextMenuShowPrev, _setContextMenuShowPrev] = useState(null);
  const [platformInfo, _setPlatformInfo] = useState(null);

  const [tabOrdersCopy, _setTabOrdersCopy] = useState([]);

  const prevTabOrders = usePrevious(tabOrders);
  const prevSearchBarInputText = usePrevious(searchBarInputText);
  useEffect(() => {
    if (
      !isEqual(prevTabOrders, tabOrders) ||
      !isEqual(prevSearchBarInputText, searchBarInputText)
    ) {
      let ordersCopy = [];
      tabOrders.forEach((tabOrder) => {
        const { combinedText } = tabOrder;
        if (combinedText.includes(searchBarInputText.toLowerCase())) {
          ordersCopy.push({
            ...tabOrder,
          });
        }
      });
      _setTabOrdersCopy(ordersCopy);
    }
  }, [tabOrders, searchBarInputText]);

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
          if (tabOrdersCopy && tabOrdersCopy.length > 0) {
            chrome.tabs.update(tabOrdersCopy[0].id, { active: true });
            clearSearchBoxInputText();
          }
        }
      }
    },
    [searchBarInputText, tabOrdersCopy]
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

  const findTab = useCallback(
    (id) => {
      const tab = tabOrdersCopy.filter((tb) => tb.id === id)[0];
      return {
        tab,
        index: tabOrdersCopy.indexOf(tab),
      };
    },
    [tabOrdersCopy]
  );

  const moveTabCard = useCallback(
    (id, atIndex) => {
      const { tab, index } = findTab(id);
      _setTabOrdersCopy(
        update(tabOrdersCopy, {
          $splice: [
            [index, 1],
            [atIndex, 0, tab],
          ],
        })
      );
    },
    [findTab, tabOrdersCopy, _setTabOrdersCopy]
  );

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
        displayTabPreviewFrame={displayTabPreviewFrame}
        contextMenuShow={contextMenuShow}
        contextMenuShowPrev={contextMenuShowPrev}
        findTab={findTab}
        moveTab={moveTabCard}
        setTabAsLoading={setTabAsLoading}
        clearSearchBoxInputText={clearSearchBoxInputText}
        isSearching={searchBarInputText.length > 0}
        setContextMenuShow={setContextMenuShow}
        clearContextMenuShow={clearContextMenuShow}
        openNewTabClickedHandler={openNewTabClickedHandler}
      />
    );
  };

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

            <div style={{ margin: 0, padding: 0 }} ref={drop}>
              {pinnedTabs.length > 0 && (
                <div className="PinnedTabsContainer">
                  {pinnedTabs.map((tabOrder, idx) => {
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

export default memo(TabsList);
