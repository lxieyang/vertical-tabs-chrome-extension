import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

let sidebarOpen = false;

const toggleSidebar = () => {
  sidebarOpen = !sidebarOpen;
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
    sendResponse({
      sidebarOpen,
    });
  } else if (
    request.from === 'content' &&
    request.msg === 'REQUEST_TOGGLE_SIDEBAR'
  ) {
    toggleSidebar();
  }
});
