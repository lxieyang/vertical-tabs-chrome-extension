import React, { useRef } from 'react';

import { useDrag, useDrop } from 'react-dnd';
import ItemTypes from '../ItemTypes';

import ReactHoverObserver from 'react-hover-observer';

import { MdClose } from 'react-icons/md';
import { MdRefresh } from 'react-icons/md';

import './Tab.css';

const Tab = ({
  idx,
  id,
  index,
  active,
  faviconUrl,
  title,
  url,
  activeTab,
  moveTab,
  isSearching,
  clearSearchBoxInputText,
}) => {
  const setTabAsActive = (event, id) => {
    clearSearchBoxInputText();
    chrome.tabs.update(id, { active: true });
  };

  const reloadTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.reload(tabId);
  };

  const closeTabClickedHandler = (e, tabId) => {
    e.stopPropagation();
    chrome.tabs.remove(tabId);
  };

  const moveTabToIndex = (tabId, toIndex) => {
    chrome.tabs.move(tabId, { index: toIndex });
  };

  /* Start of --> Drag and Drop support */
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.TABCARD,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.idx;
      const hoverIndex = idx;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveTab(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
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

  return (
    <ReactHoverObserver>
      {({ isHovering }) => (
        <li
          // style={{ opacity: isDragging ? 0 : 1 }}
          ref={ref}
          className={['TabItem', isDragging ? 'blink' : null].join(' ')}
          onClick={(event) => setTabAsActive(event, id)}
          onMouseOver={() => {
            if (!isDragging && isHovering) {
              if (index === activeTab.index) {
                chrome.tabs.highlight({ tabs: [activeTab.index] }, null);
              } else {
                chrome.tabs.highlight({ tabs: [activeTab.index, index] }, null);
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
              active ? 'TabContainerPadActive' : null,
              (!active && isHovering && idx === index) ||
              (!active && isHovering && isSearching)
                ? 'TabContainerPadInactiveHovering'
                : null,
            ].join(' ')}
          >
            <div className={'TabContainerLeftPadInner'}></div>
          </div>

          <div
            className={[
              'TabContainer',
              active ? 'ActiveTabContainer' : null,
              (!active && isHovering && idx === index) ||
              (!active && isHovering && isSearching)
                ? 'InactiveTabContainerHovering'
                : null,
            ].join(' ')}
          >
            {/* <div className="Ordinal">{tabOrder.index + 1}</div> */}
            <div className="TabFaviconContainer">
              <img
                style={{ width: 16, height: 16 }}
                src={faviconUrl}
                alt="favicon"
              />
            </div>
            <div className="TabTitleContainer" title={url}>
              {title}
            </div>

            <div
              title="Reload tab"
              className="ActionButtonContainer"
              style={{
                opacity:
                  (isHovering && idx === index) || (isSearching && isHovering)
                    ? 1
                    : 0,
              }}
            >
              <div
                className="ActionButton"
                onClick={(e) => reloadTabClickedHandler(e, id)}
              >
                <MdRefresh size={'16px'} />
              </div>
            </div>

            <div className="ActionButtonSpaceBetween"></div>

            <div title="Close tab" className="ActionButtonContainer">
              <div
                className="ActionButton"
                onClick={(e) => closeTabClickedHandler(e, id)}
              >
                <MdClose size={'16px'} />
              </div>
            </div>
          </div>

          <div
            className={[
              'TabContainerPad',
              active ? 'TabContainerPadActive' : null,
              (!active && isHovering && idx === index) ||
              (!active && isHovering && isSearching)
                ? 'TabContainerPadInactiveHovering'
                : null,
            ].join(' ')}
          >
            <div className={'TabContainerRightPadInner'}></div>
          </div>
        </li>
      )}
    </ReactHoverObserver>
  );
};

export default Tab;
