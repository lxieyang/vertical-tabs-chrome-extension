let isFirstInstall = false;
let currentVersion = chrome.runtime.getManifest().version;

localStorage.setItem('vt-version', chrome.runtime.getManifest().version);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === 'GET_VERSION_NUMBER') {
    sendResponse({ version: chrome.runtime.getManifest().version });
  }
});

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('This is a first install!');
    isFirstInstall = true;
  } else if (details.reason === 'update') {
    const thisVersion = chrome.runtime.getManifest().version;
    const prevVersion = details.previousVersion;
    console.log(thisVersion, prevVersion);
  }
  if (details.reason === 'install' || details.reason === 'update') {
    console.log('go to release log page');
    chrome.tabs.create({
      url: `https://github.com/lxieyang/vertical-tabs-chrome-extension/blob/master/CHANGELOG.md#v2x-official-releases`,
    });
  }
});

let shouldShowTips = false;

chrome.storage.local.get(['shouldShowTips'], (result) => {
  if (result.shouldShowTips !== undefined) {
    shouldShowTips = false;
    persistShouldShowTipsStatus(false);
  } else {
    shouldShowTips = true;
    persistShouldShowTipsStatus(true);
  }

  console.log('shouldShowTips:', shouldShowTips);
});

chrome.browserAction.setTitle({
  title: `Vertical Tabs: Use Command + E (Ctrl + E on PC) to toggle the sidebar`,
});

const persistShouldShowTipsStatus = (toStatus) => {
  chrome.storage.local.set({
    shouldShowTips: toStatus,
  });
};
