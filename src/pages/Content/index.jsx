import copy from 'clipboard-copy';
import './helpers/SidebarHelper';
import './helpers/TabPreviewHelper';
import './helpers/UpdateNoticeHelper';

window.addEventListener('message', (event) => {
  const { msg, payload } = event.data;
  if (msg === 'COPY_URL') {
    copy(payload.url);
  }
});
