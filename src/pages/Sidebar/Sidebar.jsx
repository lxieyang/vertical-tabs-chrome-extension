import React, { Component } from 'react';
import { sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';

class Sidebar extends Component {
  state = {
    tabOrders: [],
    tabsDict: {},
  };

  componentDidMount() {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      const tabsDict = {};
      let tabOrders = [];
      tabs.forEach((tab) => {
        tab.faviconUrl = `chrome://favicon/${tab.url}`;
        tabsDict[tab.id] = {
          faviconUrl: tab.faviconUrl,
          id: tab.id,
          title: tab.title,
          url: tab.url,
        };
        tabOrders.push({
          id: tab.id,
          index: tab.index,
          active: tab.active,
        });
      });
      tabOrders = sortBy(tabOrders, ['index']);
      // console.log(tabOrders, tabsDict);
      this.setState({ tabOrders, tabsDict });
    });

    this.tabCreatedHandler = this.handleTabCreated.bind(this);
    this.tabRemovedHandler = this.handleTabRemoved.bind(this);
    this.tabUpdatedHandler = this.handleTabUpdated.bind(this);
    this.tabMovedHandler = this.handleTabMoved.bind(this);
    this.tabActivatedHandler = this.handleTabActivated.bind(this);
    this.tabHighlightedHandler = this.handleTabHighlighted.bind(this);

    chrome.tabs.onCreated.addListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.addListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.addListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.addListener(this.tabMovedHandler);
    chrome.tabs.onActivated.addListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.addListener(this.tabHighlightedHandler);
  }

  componentWillUnmount() {
    chrome.tabs.onCreated.removeListener(this.tabCreatedHandler);
    chrome.tabs.onRemoved.removeListener(this.tabRemovedHandler);
    chrome.tabs.onUpdated.removeListener(this.tabUpdatedHandler);
    chrome.tabs.onMoved.removeListener(this.tabMovedHandler);
    chrome.tabs.onActivated.removeListener(this.tabActivatedHandler);
    chrome.tabs.onHighlighted.removeListener(this.tabHighlightedHandler);
  }

  updateTabsDictWithTab = (
    tab,
    favicon = 'chrome://favicon/chrome://newtab/'
  ) => {
    let tabsDict = { ...this.state.tabsDict };
    tabsDict[tab.id] = {
      faviconUrl: favicon,
      id: tab.id,
      title: tab.title,
      url: tab.url,
    };
    this.setState({ tabsDict });
  };

  updateTabOrders = () => {
    chrome.tabs.query({ currentWindow: true }, (tabs) => {
      let tabOrders = [];
      tabs.forEach((tab) => {
        tabOrders.push({
          id: tab.id,
          index: tab.index,
          active: tab.active,
        });
      });
      tabOrders = sortBy(tabOrders, ['index']);
      this.setState({ tabOrders });
    });
  };

  handleTabCreated = (tab) => {
    console.log(tab);
    this.updateTabsDictWithTab(tab);
    this.updateTabOrders();
  };

  handleTabUpdated = (tabId, changes, tab) => {
    if (changes.status === 'complete' || changes.title) {
      this.updateTabsDictWithTab(tab, `chrome://favicon/${tab.url}`);
      if (changes.status === 'complete') {
        setTimeout(() => {
          // make the 'chrome://favicon/' API more reliable
          this.updateTabsDictWithTab(tab, `chrome://favicon/${tab.url}`);
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

  handleTabHighlighted = (highlightInfo) => {
    // console.log(highlightInfo);
  };

  handleRemoveTab = (tabId) => {
    let currentTabId;
    chrome.tabs.getCurrent((tab) => {
      currentTabId = tab.id;
      chrome.tabs.remove(tabId);
      chrome.tabs.update(currentTabId, { active: true });
    });
    // chrome.runtime.sendMessage({
    //   from: 'sidebar',
    //   msg: 'CLOSE_TAB_WITH_ID',
    //   tabId,
    // });
  };

  render() {
    const { tabOrders, tabsDict } = this.state;
    return (
      <div>
        <ul style={{ padding: '0px 10px' }}>
          {tabOrders.map((tabOrder, idx) => {
            if (tabsDict[tabOrder.id] === undefined) {
              return null;
            }

            let tab = tabsDict[tabOrder.id];
            return (
              <li
                key={idx}
                className={[
                  'TabContainer',
                  tabOrder.active
                    ? 'ActiveTabContainer'
                    : 'InactiveTabContainer',
                ].join(' ')}
                onClick={() => {
                  chrome.tabs.update(tab.id, { active: true });
                }}
              >
                {/* <div className="Ordinal">{tabOrder.index + 1}</div> */}
                <img
                  src={tab.faviconUrl ? tab.faviconUrl : tab.favIconUrl}
                  alt="favicon"
                  style={{ marginRight: '5px' }}
                />{' '}
                <div style={{ flex: 1 }}>{tab.title}</div>
                <div
                  title="Reload"
                  className="ActionButton"
                  style={{ marginRight: 10, cursor: 'pointer' }}
                  onClick={() => {
                    chrome.tabs.reload(tab.id);
                  }}
                >
                  <FontAwesomeIcon icon={faRedo} />
                </div>
                <div
                  title="Close"
                  className="ActionButton"
                  style={{ marginRight: 10, cursor: 'pointer' }}
                  onClick={() => this.handleRemoveTab(tab.id)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </div>
              </li>
            );
          })}
          <li
            className="TabContainer NewTabIconContainer"
            title="Open a new tab"
            onClick={() => {
              chrome.tabs.create({});
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
