import copy from 'clipboard-copy';
import './helpers/UpdateNoticeHelper';
import './helpers/SidebarHelper';
import './helpers/TabPreviewHelper';

window.addEventListener('message', (event) => {
  const { msg, payload } = event.data;
  if (msg === 'COPY_URL') {
    copy(payload.url);
  }
});
