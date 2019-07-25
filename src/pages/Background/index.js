import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.browserAction.onClicked.addListener((tab) => {
  let tabId = tab.id;
  chrome.tabs.sendMessage(tabId, {
    from: 'background',
    msg: 'TOGGLE_SIDEBAR',
  });
});
