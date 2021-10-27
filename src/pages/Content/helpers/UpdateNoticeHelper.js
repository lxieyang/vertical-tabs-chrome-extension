import React from 'react';
import ReactDOM from 'react-dom';
import { sidebarRoot } from './SidebarHelper';
import { SIDEBAR_CONTAINER_ID } from '../../../shared/constants';
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
        updateNoticeRoot.style.zIndex = '999999999';
        ReactDOM.render(<UpdateNotice />, updateNoticeRoot);
        const sidebarIframe = sidebarRoot.querySelector('iframe');
        sidebarIframe.style.opacity = 0.4;
        sidebarIframe.style.pointerEvents = 'none';
        sidebarIframe.style.userSelect = 'none';
        document.querySelector(`#${SIDEBAR_CONTAINER_ID}`).style.cursor =
          'not-allowed';
      } else {
        updateNoticeRoot.style.zIndex = null;
        ReactDOM.unmountComponentAtNode(updateNoticeRoot);
      }
    }
  }
});
