import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.browserAction.onClicked.addListener((senderTab) => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    function(tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          from: 'background',
          msg: 'TOGGLE_SIDEBAR',
        });
      });
    }
  );

  // chrome.tabs.sendMessage(senderTab.id, {
  //   from: 'background',
  //   msg: 'TOGGLE_SIDEBAR',
  // });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.from === 'sidebar' && request.msg === 'CLOSE_TAB_WITH_ID') {
    let tabId = request.tabId;
    chrome.tabs.remove(tabId);
  }
});
