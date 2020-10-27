import React from 'react';

import AppLogo from '../../assets/img/icon-128.png';
import './Logo.css';

/*
  props:
    - hover: boolean (true / false)
    - size: string ('50px')
*/

const logo = (props) => {
  let src = AppLogo;

  if (window.chrome !== undefined && chrome.extension !== undefined) {
    src = chrome.extension.getURL('icon-128.png');
  }

  return (
    <div
      className={props.hover ? 'Logo' : null}
      style={{
        ...props.style,
        width: props.size,
        height: props.size,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <img className="Img" src={src} alt="APP Logo" />
    </div>
  );
};

export default logo;
