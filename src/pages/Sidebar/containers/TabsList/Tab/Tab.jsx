import React, { useRef, useContext } from 'react';
import DarkModeContext from '../../../context/dark-mode-context';
import Loader from 'react-loader-spinner';
import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from '../ItemTypes';

import ReactHoverObserver from 'react-hover-observer';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import copy from 'clipboard-copy';

import { MdClose } from 'react-icons/md';
import { MdRefresh } from 'react-icons/md';
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { FaThumbtack } from 'react-icons/fa';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import './Tab.css';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Tab = ({
  idx,
  id,
  index,
  active,
  pinned,
  mutedInfo,
  audible,
  faviconUrl,
  title,
  url,
  status,
  activeTab,
  displayTabInFull,
  contextMenuShow,
  contextMenuShowPrev,
  moveTab,
  setTabAsLoading,
  isSearching,
  clearSearchBoxInputText,
  setContextMenuShow,
  clearContextMenuShow,
  openNewTabClickedHandler,
}) => {
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  /* Start of --> Drag and Drop support */
  const ref = useRef(null);

  const darkModeContext = useContext(DarkModeContext);
  const { isDark } = darkModeContext;

  const [, drop] = useDrop({
    accept: ItemTypes.TABCARD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.idx;
      const hoverIndex = idx;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTab(dragIndex, hoverIndex);
      item.idx = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.TABCARD, id, idx },
    end: (item, monitor) => {
      moveTabToIndex(id, item.idx);
    },
    canDrag(monitor) {
      return !isSearching;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
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
    copy(url).then(() => {
      setOpenSnackbar(true);
    });
  };

  const closeTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
  };

  const moveTabToIndex = (tabId, toIndex) => {
    chrome.tabs.move(tabId, { index: toIndex });
  };
  /* End of --> Utility functions */

  return (
    <ReactHoverObserver>
      {({ isHovering }) => (
        <React.Fragment>
          <ContextMenuTrigger id={id.toString()} holdToDisplay={-1}>
            <li
              // style={{ opacity: isDragging ? 0 : 1 }}
              ref={ref}
              className={['TabItem', isDragging ? 'blink' : null].join(' ')}
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
              onMouseLeave={() => {
                if (!isDragging) {
                  if (index !== activeTab.index) {
                    chrome.tabs.update(id, { highlighted: false });
                  }
                }
              }}
            >
              <div
                className={[
                  'TabContainerPad',
                  isDark ? 'Dark' : null,
                  active ? 'TabContainerPadActive' : null,
                  (!active && isHovering && idx === index) ||
                  (!active && isHovering && isSearching)
                    ? 'TabContainerPadInactiveHovering'
                    : null,
                ].join(' ')}
              >
                <div
                  className={[
                    'TabContainerLeftPadInner',
                    isDark ? 'Dark' : null,
                  ].join(' ')}
                ></div>
              </div>

              <div
                className={[
                  'TabContainer',
                  isDark ? 'Dark' : null,
                  active ? 'ActiveTabContainer' : null,
                  (!active && isHovering && idx === index) ||
                  (!active && isHovering && isSearching)
                    ? 'InactiveTabContainerHovering'
                    : null,
                ].join(' ')}
              >
                {pinned && (
                  <div className="PinnedIconContainer">
                    <FaThumbtack
                      className={['PinnedIcon', isDark ? 'Dark' : null].join(
                        ' '
                      )}
                    />
                  </div>
                )}

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

                <div
                  className="TabTitleContainer"
                  title={displayTabInFull ? url : `${title}\n\n${url}`}
                >
                  <div
                    className={[
                      'TabTitle',
                      displayTabInFull ? null : 'Truncated',
                    ].join(' ')}
                  >
                    {title}
                  </div>
                  {mutedInfo.muted && audible && (
                    <div
                      className={[
                        'MutedIconContainer',
                        isDark ? 'Dark' : null,
                      ].join(' ')}
                      onClick={(e) => muteTabClickedHandler(e, id)}
                    >
                      <MdVolumeOff size={'16px'} />
                    </div>
                  )}
                  {!mutedInfo.muted && audible && (
                    <div
                      className={[
                        'MutedIconContainer',
                        isDark ? 'Dark' : null,
                      ].join(' ')}
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
                    className={[
                      'TabItemActionButton',
                      isDark ? 'Dark' : null,
                    ].join(' ')}
                    onClick={(e) => reloadTabClickedHandler(e, id)}
                  >
                    <MdRefresh size={'16px'} />
                  </div>
                </div>

                <div className="TabItemActionButtonSpaceBetween"></div>

                <div title="Close tab" className="TabItemActionButtonContainer">
                  <div
                    className={[
                      'TabItemActionButton',
                      isDark ? 'Dark' : null,
                    ].join(' ')}
                    onClick={(e) => closeTabClickedHandler(e, id)}
                  >
                    <MdClose size={'16px'} />
                  </div>
                </div>
              </div>

              <div
                className={[
                  'TabContainerPad',
                  isDark ? 'Dark' : null,
                  active ? 'TabContainerPadActive' : null,
                  (!active && isHovering && idx === index) ||
                  (!active && isHovering && isSearching)
                    ? 'TabContainerPadInactiveHovering'
                    : null,
                ].join(' ')}
              >
                <div
                  className={[
                    'TabContainerRightPadInner',
                    isDark ? 'Dark' : null,
                  ].join(' ')}
                ></div>
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
            className={[isDark ? 'Dark' : null].join(' ')}
          >
            <MenuItem onClick={(e) => openNewTabClickedHandler()}>
              New Tab
            </MenuItem>

            <MenuItem divider className={[isDark ? 'Dark' : null].join(' ')} />

            <MenuItem onClick={(e) => reloadTabClickedHandler(e, id)}>
              Reload
            </MenuItem>
            <MenuItem onClick={(e) => deplicateTabClickedHandler(e, id)}>
              Duplicate
            </MenuItem>
            <MenuItem onClick={(e) => pinTabClickedHandler(e, id)}>
              {pinned ? 'Unpin' : 'Pin'}
            </MenuItem>
            <MenuItem onClick={(e) => muteTabClickedHandler(e, id)}>
              {mutedInfo.muted ? 'Unmute' : 'Mute'} This Tab
            </MenuItem>
            <MenuItem onClick={(e) => copyTabURLClickedHandler(e, id)}>
              Copy Tab URL
            </MenuItem>

            <MenuItem divider className={[isDark ? 'Dark' : null].join(' ')} />

            <MenuItem onClick={(e) => closeTabClickedHandler(e, id)}>
              Close
            </MenuItem>
          </ContextMenu>

          {/* snackbar */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={2500}
            onClose={handleSnackbarClose}
          >
            <Alert onClose={handleSnackbarClose} severity="success">
              Copied to clipboard!
            </Alert>
          </Snackbar>
        </React.Fragment>
      )}
    </ReactHoverObserver>
  );
};

export default Tab;
