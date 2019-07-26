import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

let sidebarOpen = true; // open -> true  |  close -> false

chrome.storage.local.get(['sidebarOpen'], (result) => {
  if (result.sidebarOpen !== undefined) {
    sidebarOpen = result.sidebarOpen === true;
    changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
  }
});

const changeBrowserIconBadgeWithSidebarOpenStatus = (status) => {
  if (status) {
    chrome.browserAction.setBadgeText({
      text: '👀',
    });
    chrome.browserAction.setBadgeBackgroundColor({
      color: [255, 255, 255, 100],
    });
  } else {
    chrome.browserAction.setBadgeText({
      text: '',
    });
  }
};

const persistSidebarOpenStatus = (status) => {
  chrome.storage.local.set({
    sidebarOpen: status,
  });
};

let sidebarOnLeft = true; // left -> true  |  right -> false

chrome.storage.sync.get(['sidebarOnLeft'], (result) => {
  if (result.sidebarOnLeft !== undefined) {
    sidebarOnLeft = result.sidebarOnLeft === true;
  } else {
    persistSidebarOnLeftStatus(true);
  }
});

const persistSidebarOnLeftStatus = (status) => {
  chrome.storage.sync.set({
    sidebarOnLeft: status,
  });
};

const toggleSidebar = (toStatus = null) => {
  if (toStatus === null || toStatus === undefined) {
    sidebarOpen = !sidebarOpen;
  } else {
    sidebarOpen = toStatus;
  }
  persistSidebarOpenStatus(sidebarOpen);
  changeBrowserIconBadgeWithSidebarOpenStatus(sidebarOpen);
  let sidebarOpenCopy = sidebarOpen;
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'TOGGLE_SIDEBAR',
          toStatus: sidebarOpenCopy,
        });
      });
    }
  );
};

const updateSidebarWidth = (width) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'UPDATE_SIDEBAR_WIDTH',
          width,
        });
      });
    }
  );
};

chrome.browserAction.onClicked.addListener((senderTab) => {
  toggleSidebar();

  // chrome.tabs.sendMessage(senderTab.id, {
  //   from: 'background',
  //   msg: 'TOGGLE_SIDEBAR',
  // });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'sidebar' && request.msg === 'CLOSE_TAB_WITH_ID') {
    let tabId = request.tabId;
    chrome.tabs.remove(tabId);
  } else if (
    request.from === 'content' &&
    request.msg === 'REQUEST_SIDEBAR_STATUS'
  ) {
    console.log('sending', sidebarOpen);
    sendResponse({
      sidebarOpen,
    });
  } else if (
    request.from === 'content' &&
    request.msg === 'REQUEST_TOGGLE_SIDEBAR'
  ) {
    toggleSidebar(request.toStatus);
  } else if (request.from === 'content' && request.msg === 'WIDTH_CHANGED') {
    console.log(request.width);
    // console.log(request.width);
    updateSidebarWidth(request.width);
  }
});
