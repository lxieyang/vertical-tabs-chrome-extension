import React, { useRef, useContext, memo } from 'react';
import classNames from 'classnames';
import DarkModeContext from '../../../context/dark-mode-context';
import Loader from 'react-loader-spinner';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from '../ItemTypes';

import ReactHoverObserver from 'react-hover-observer';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import { MdClose } from 'react-icons/md';
import { MdRefresh } from 'react-icons/md';
import { IoIosRefresh } from 'react-icons/io';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import {
  FaThumbtack,
  FaRegWindowMaximize,
  FaRegWindowRestore,
  FaRegCopy,
} from 'react-icons/fa';

import { useSnackbar } from 'react-simple-snackbar';

import './Tab.css';

function fetchFavicon(url) {
  return new Promise(function (resolve, reject) {
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(this, 0, 0);

      var dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };
    img.src = url;
  });
}

const Tab = ({
  idx,
  id,
  index,
  active,
  pinned,
  mutedInfo,
  openerTabId,
  audible,
  faviconUrl,
  title,
  url,
  status,
  activeTab,
  displayTabInFull,
  displayTabPreviewFrame,
  contextMenuShow,
  contextMenuShowPrev,
  findTab,
  moveTab,
  setTabAsLoading,
  isSearching,
  clearSearchBoxInputText,
  setContextMenuShow,
  clearContextMenuShow,
  openNewTabClickedHandler,
}) => {
  const [openSnackbar] = useSnackbar({
    style: { backgroundColor: '#4DC71F', fontWeight: 600 },
  });

  const darkModeContext = useContext(DarkModeContext);
  const { isDark } = darkModeContext;

  const tabItemRef = useRef(null);

  /* Start of --> Drag and Drop support */
  const dndRef = useRef(null);
  const originalIndex = findTab(id).index;
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.TABCARD,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      isDragging: (monitor) => {
        hideTabPreview();
      },
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const { index: overIndex } = findTab(droppedId);
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveTab(droppedId, originalIndex);
        } else {
          moveTabToIndex(id, overIndex);
        }
      },
    }),
    [id, originalIndex, moveTab]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.TABCARD,
      canDrop: () => false,
      hover({ id: draggedId, originalIndex: draggedIndex }) {
        if (draggedId !== id) {
          const { index: overIndex } = findTab(id);
          moveTab(draggedId, overIndex);
          hideTabPreview();
        }
      },
    }),
    [findTab, moveTab]
  );

  drag(drop(dndRef));
  /* End of --> Drag and Drop support */

  /* Start of --> Utility functions */
  const setTabAsActive = (event, tabId) => {
    clearSearchBoxInputText();
    chrome.tabs.update(tabId, { active: true });
  };

  const reloadTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    setTabAsLoading(tabId);
    chrome.tabs.reload(tabId);
  };

  const deplicateTabClickedHandler = (e, tabId) => {
    chrome.tabs.duplicate(tabId);
  };

  const pinTabClickedHandler = (e, tabId) => {
    chrome.tabs.update(id, { pinned: !pinned });
  };

  const muteTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.update(id, { muted: mutedInfo.muted ? false : true });
  };

  const copyTabURLClickedHandler = (e, tabId) => {
    window.parent.postMessage(
      {
        msg: 'COPY_URL',
        payload: {
          url,
        },
      },
      '*'
    );
    openSnackbar('Copied to clipboard!', 2500);
  };

  const closeTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
  };

  const moveTabToIndex = (tabId, toIndex) => {
    chrome.tabs.move(tabId, { index: toIndex });
  };
  /* End of --> Utility functions */

  const showTabPreview = async () => {
    if (!displayTabPreviewFrame) {
      return;
    }
    try {
      const tabItemBB = tabItemRef.current.getBoundingClientRect();
      const { y: tabItemY } = tabItemBB;
      // console.log(tabItemY, url, title);
      // console.log(faviconUrl);
      let faviconDataUrl = await fetchFavicon(faviconUrl);
      window.parent.postMessage(
        {
          msg: 'PREVIEW_TAB_ON',
          payload: {
            id,
            title,
            url,
            faviconUrl: faviconDataUrl,
            tabItemY,
            isDark,
          },
        },
        '*'
      );
    } catch (err) {
      // console.log(err);
    }
  };

  const hideTabPreview = () => {
    if (!displayTabPreviewFrame) {
      return;
    }
    window.parent.postMessage(
      {
        msg: 'PREVIEW_TAB_OFF',
      },
      '*'
    );
  };

  return (
    <ReactHoverObserver>
      {({ isHovering }) => (
        <React.Fragment>
          <ContextMenuTrigger id={id.toString()} holdToDisplay={-1}>
            <li
              ref={tabItemRef}
              // title={`${title}\n\n${url}`}
              className={classNames({
                TabItem: true,
                blink: isDragging,
              })}
              onClick={(event) => {
                if (contextMenuShowPrev && !contextMenuShow) {
                  clearContextMenuShow();
                  return;
                }
                setTabAsActive(event, id);
              }}
              onMouseOver={() => {
                if (!isDragging && isHovering) {
                  if (index === activeTab.index) {
                    chrome.tabs.highlight({ tabs: [activeTab.index] }, null);
                  } else {
                    chrome.tabs.highlight(
                      { tabs: [activeTab.index, index] },
                      null
                    );
                  }
                }
              }}
              onMouseEnter={() => {
                showTabPreview();
              }}
              onMouseLeave={() => {
                if (!isDragging) {
                  if (index !== activeTab.index) {
                    chrome.tabs.update(id, { highlighted: false });
                  }
                }

                hideTabPreview();
              }}
            >
              <div
                ref={dndRef}
                className={classNames({
                  TabContainer: true,
                  isPinned: pinned,
                  Dark: isDark,
                  ActiveTabContainer: active,
                  InactiveTabContainerHovering:
                    (!active && isHovering && idx === index) ||
                    (!active && isHovering && isSearching),
                })}
              >
                <div className="TabFaviconContainer">
                  {status === 'loading' ? (
                    <Loader
                      type="TailSpin"
                      color="rgb(0, 102, 228)"
                      height={16}
                      width={16}
                    />
                  ) : (
                    <img
                      style={{ width: 16, height: 16 }}
                      src={faviconUrl}
                      alt="favicon"
                    />
                  )}
                </div>

                {!pinned && (
                  <>
                    <div className="TabTitleContainer">
                      <div
                        className={classNames({
                          TabTitle: true,
                          Truncated: !displayTabInFull,
                        })}
                      >
                        {title}
                      </div>
                      {mutedInfo.muted && audible && (
                        <div
                          className={classNames({
                            MutedIconContainer: true,
                            Dark: isDark,
                          })}
                          onClick={(e) => muteTabClickedHandler(e, id)}
                        >
                          <MdVolumeOff size={'16px'} />
                        </div>
                      )}
                      {!mutedInfo.muted && audible && (
                        <div
                          className={classNames({
                            MutedIconContainer: true,
                            Dark: isDark,
                          })}
                          onClick={(e) => muteTabClickedHandler(e, id)}
                        >
                          <MdVolumeUp size={'16px'} />
                        </div>
                      )}
                    </div>

                    <div
                      title="Reload tab"
                      className="TabItemActionButtonContainer"
                      style={{
                        opacity:
                          (isHovering && idx === index) ||
                          (isSearching && isHovering)
                            ? 1
                            : 0,
                      }}
                    >
                      <div
                        className={classNames({
                          TabItemActionButton: true,
                          Dark: isDark,
                        })}
                        onClick={(e) => reloadTabClickedHandler(e, id)}
                      >
                        <MdRefresh size={'16px'} />
                      </div>
                    </div>

                    <div className="TabItemActionButtonSpaceBetween"></div>

                    <div
                      title="Close tab"
                      className="TabItemActionButtonContainer"
                    >
                      <div
                        className={classNames({
                          TabItemActionButton: true,
                          Dark: isDark,
                        })}
                        onClick={(e) => closeTabClickedHandler(e, id)}
                      >
                        <MdClose size={'16px'} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </li>
          </ContextMenuTrigger>
          <ContextMenu
            id={id.toString()}
            onShow={(e) => {
              setContextMenuShow(true);
            }}
            onHide={(e) => {
              setContextMenuShow(false);
            }}
            className={classNames({
              Dark: isDark,
            })}
          >
            <MenuItem onClick={(e) => openNewTabClickedHandler()}>
              <div className="MenuItemIconContainer">
                <FaRegWindowMaximize size={'15px'} />
              </div>
              New Tab
            </MenuItem>

            <MenuItem
              divider
              className={classNames({
                Dark: isDark,
              })}
            />

            <MenuItem onClick={(e) => reloadTabClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                <IoIosRefresh size={'15px'} />
              </div>
              Reload
            </MenuItem>
            <MenuItem onClick={(e) => deplicateTabClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                <FaRegWindowRestore size={'15px'} />
              </div>
              Duplicate
            </MenuItem>
            <MenuItem onClick={(e) => pinTabClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                <FaThumbtack
                  size={'16px'}
                  style={{ transform: 'rotate(-45deg)' }}
                />
              </div>
              {pinned ? 'Unpin' : 'Pin'}
            </MenuItem>
            <MenuItem onClick={(e) => muteTabClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                {!mutedInfo.muted ? (
                  <MdVolumeOff size={'15px'} />
                ) : (
                  <MdVolumeUp size={'15px'} />
                )}
              </div>
              {mutedInfo.muted ? 'Unmute' : 'Mute'} This Tab
            </MenuItem>
            <MenuItem onClick={(e) => copyTabURLClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                <FaRegCopy size={'15px'} />
              </div>
              Copy Tab URL
            </MenuItem>

            <MenuItem
              divider
              className={classNames({
                Dark: isDark,
              })}
            />

            <MenuItem onClick={(e) => closeTabClickedHandler(e, id)}>
              <div className="MenuItemIconContainer">
                <MdClose size={'15px'} />
              </div>
              Close
            </MenuItem>
          </ContextMenu>
        </React.Fragment>
      )}
    </ReactHoverObserver>
  );
};

export default memo(Tab);
