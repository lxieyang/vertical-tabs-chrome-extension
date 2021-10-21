import React from 'react';
import ReactDOM from 'react-dom';
import UpdateNotice from '../modules/UpdateNotice/UpdateNotice';

let updateNoticeRoot = document.createElement('div');
document.body.appendChild(updateNoticeRoot);
updateNoticeRoot.setAttribute('id', 'vt-update-notice');
localStorage.removeItem('vt-update-notice-dismissed');

document.addEventListener('visibilitychange', (info) => {
  // console.log(info);
  // console.log(document.hidden);
  try {
    chrome.runtime.sendMessage({ msg: 'GET_VERSION_NUMBER' }, (response) => {
      // console.log(response);
    });
  } catch (err) {
    if (err.toString().indexOf('Extension context invalidated') !== -1) {
      if (!document.hidden) {
        console.log('should refresh page');
        ReactDOM.render(<UpdateNotice />, updateNoticeRoot);
      } else {
        ReactDOM.unmountComponentAtNode(updateNoticeRoot);
      }
    }
  }
});
