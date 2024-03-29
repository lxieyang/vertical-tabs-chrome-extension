import React, { Component } from 'react';
import classNames from 'classnames';
import DarkModeContext from './context/dark-mode-context';
import { sortBy } from 'lodash';

import Title from './containers/Title/Title';
import TabsList from './containers/TabsList/TabsList';

import { getFavicon } from '../../shared/utils';

// import UpdateNotice from '../Content/modules/UpdateNotice/UpdateNotice';

import './Sidebar.css';

class Sidebar extends Component {
  state = {
    tabOrders: [],
    activeTab: {},
    tabsDict: {},

    displayTabInFull: true,
    displayTabPreviewFrame: true,
  };

  constructor(props) {
    super(props);

    this.tabCreatedHandler = this.handleTabCreated.bind(this);
    this.tabRemovedHandler = this.handleTabRemoved.bind(this);
    this.tabUpdatedHandler = this.handleTabUpdated.bind(this);
    this.tabMovedHandler = this.handleTabMoved.bind(this);
    this.tabActivatedHandler = this.handleTabActivated.bind(this);

    chrome.tabs.onCreated.addListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.addListener(this.tabMovedHandler);
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler);
  }

  componentDidMount() {
    this.retrieveTabs();

    window.addEventListener('keydown', (event) => {
      if (
        (event.ctrlKey && event.key === '`') ||
        (event.ctrlKey && event.key === 'Escape') ||
        (event.metaKey && event.key === 'Escape') ||
        (event.altKey && event.key === '`') ||
        (event.altKey && event.key === 'Escape')
      ) {
        chrome.runtime.sendMessage({
          from: 'content',
          msg: 'REQUEST_TOGGLE_SIDEBAR',
        });
      }
    });

    // sync scroll positions
    window.addEventListener('scroll', this.handleScroll, false);
    chrome.runtime.sendMessage(
      {
        from: 'sidebar',
        msg: 'REQUEST_SIDEBAR_SCROLL_POSITION',
      },
      (response) => {
        window.scroll(response.scrollPositionX, response.scrollPositionY);
      }
    );
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (
        request.from === 'background' &&
        request.msg === 'UPDATE_SIDEBAR_SCROLL_POSITION'
      ) {
        window.scroll(request.scrollPositionX, request.scrollPositionY);
      }
    });
  }

  componentWillUnmount() {
    chrome.tabs.onCreated.removeListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.removeListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.removeListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.removeListener(this.tabMovedHandler);
    chrome.tabs.onActivated.removeListener(this.tabActivatedHandler);

    window.removeEventListener('scroll', this.handleScroll);
  }

  retrieveTabs = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const tabsDict = {};
      let tabOrders = [];
      tabs.forEach((tab) => {
        tab.faviconUrl = getFavicon(tab.url);

        tabsDict[tab.id] = {
          faviconUrl: tab.faviconUrl,
          title: tab.title,
          url: tab.url,
          pinned: tab.pinned,
          status: 'complete',
          combinedText: [
            tab.title, // title
            tab.url !== '' ? new URL(tab.url).hostname.replace('www.', '') : '', // hostname
          ]
            .join(' ')
            .toLowerCase(),
          mutedInfo: tab.mutedInfo,
          audible: tab.audible,
          openerTabId: tab.openerTabId,
        };

        tabOrders.push({
          id: tab.id,
          index: tab.index,
          active: tab.active,
        });
        if (tab.active) {
          this.setState({
            activeTab: {
              id: tab.id,
              index: tab.index,
              active: tab.active,
            },
          });
        }
      });
      tabOrders = sortBy(tabOrders, ['index']);
      this.setState({ tabOrders, tabsDict });
    });
  };

  handleScroll = (event) => {
    // https://gomakethings.com/detecting-when-a-visitor-has-stopped-scrolling-with-vanilla-javascript/
    // Clear our timeout throughout the scroll
    window.clearTimeout(this.isScrolling);

    // Set a timeout to run after scrolling ends
    this.isScrolling = setTimeout(function () {
      chrome.runtime.sendMessage({
        from: 'sidebar',
        msg: 'SIDEBAR_SCROLL_POSITION_CHANGED',
        scrollPositionX: window.pageXOffset,
        scrollPositionY: window.pageYOffset,
      });
    }, 66);
  };

  updateTabsDictWithTab = (tab, favicon = getFavicon('chrome://newtab/')) => {
    let tabsDict = { ...this.state.tabsDict };
    tabsDict[tab.id] = {
      faviconUrl: favicon,
      title: tab.title,
      url: tab.url,
      pinned: tab.pinned,
      status: tab.status,
      combinedText: [
        tab.title, // title
        tab.url !== '' ? new URL(tab.url).hostname.replace('www.', '') : '', // hostname
      ]
        .join(' ')
        .toLowerCase(),
      mutedInfo: tab.mutedInfo,
      audible: tab.audible,
      openerTabId: tab.openerTabId,
    };
    this.setState({ tabsDict });
  };

  setTabAsLoading = (tabId) => {
    let tabsDict = { ...this.state.tabsDict };
    let targetTab = tabsDict[tabId];
    tabsDict[tabId] = {
      ...targetTab,
      status: 'loading',
    };
    this.setState({ tabsDict });
  };

  updateTabOrders = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      let tabOrders = [];
      tabs.forEach((tab) => {
        let tabObj = {
          id: tab.id,
          index: tab.index,
          active: tab.active,
        };
        tabOrders.push(tabObj);
        if (tab.active) {
          this.setState({ activeTab: tabObj });
        }
      });
      tabOrders = sortBy(tabOrders, ['index']);
      this.setState({ tabOrders });
    });
  };

  handleTabCreated = (tab) => {
    this.updateTabsDictWithTab(tab);
    this.updateTabOrders();
  };

  handleTabUpdated = (tabId, changes, tab) => {
    if (
      changes.status === 'complete' ||
      changes.title ||
      changes.pinned === true ||
      changes.pinned === false ||
      changes.mutedInfo ||
      changes.audible !== undefined
    ) {
      this.updateTabsDictWithTab(tab, getFavicon(tab.url));
      if (changes.status === 'complete') {
        setTimeout(() => {
          // make the 'chrome://favicon/' API more reliable
          this.updateTabsDictWithTab(tab, getFavicon(tab.url));
        }, 5000);
      }
    }
  };

  handleTabRemoved = (tabId) => {
    this.setState((prevState) => {
      let tabsDict = { ...prevState.tabsDict };
      delete tabsDict[tabId];
      return {
        tabsDict,
      };
    });

    this.updateTabOrders();
  };

  handleTabMoved = (tabId) => {
    this.updateTabOrders();
  };

  handleTabActivated = (activeInfo) => {
    this.updateTabOrders();
  };

  setDisplayTabInFull = (toStatus) => {
    this.setState({ displayTabInFull: toStatus });
  };

  setDisplayTabPreviewFrame = (toStatus) => {
    this.setState({ displayTabPreviewFrame: toStatus });
  };

  render() {
    const {
      tabOrders,
      activeTab,
      tabsDict,
      displayTabInFull,
      displayTabPreviewFrame,
    } = this.state;

    return (
      <DarkModeContext.Consumer>
        {({ isDark }) => (
          <div
            className={classNames({
              SidebarContainer: true,
              Dark: isDark,
            })}
          >
            <Title
              setDisplayTabInFull={this.setDisplayTabInFull}
              setDisplayTabPreviewFrame={this.setDisplayTabPreviewFrame}
            />
            <TabsList
              displayTabInFull={displayTabInFull}
              displayTabPreviewFrame={displayTabPreviewFrame}
              tabOrders={tabOrders
                .filter(({ id }) => tabsDict[id] !== undefined)
                .map((tabOrder) => ({
                  ...tabOrder,
                  ...tabsDict[tabOrder.id],
                }))}
              activeTab={activeTab}
              setTabAsLoading={this.setTabAsLoading}
            />
            {/* <UpdateNotice /> */}
          </div>
        )}
      </DarkModeContext.Consumer>
    );
  }
}

export default Sidebar;
