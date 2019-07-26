import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

let sidebarOpen = true;

chrome.storage.local.get(['sidebarOpen'], (result) => {
  if (result.sidebarOpen !== undefined) {
    sidebarOpen = result.sidebarOpen === 'true';
  }
});

const persistSidebarOpenStatus = (status) => {
  chrome.storage.local.set({
    sidebarOpen: status,
  });
};

const toggleSidebar = () => {
  sidebarOpen = !sidebarOpen;
  persistSidebarOpenStatus(sidebarOpen);
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
    toggleSidebar();
  } else if (request.from === 'content' && request.msg === 'WIDTH_CHANGED') {
    console.log(request.width);
    // console.log(request.width);
    updateSidebarWidth(request.width);
  }
});
