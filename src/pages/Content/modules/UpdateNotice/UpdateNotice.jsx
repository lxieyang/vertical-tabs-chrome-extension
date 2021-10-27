import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimesCircle as DismissIcon } from 'react-icons/fa';
import { MdRefresh as RefreshIcon } from 'react-icons/md';
import { APP_NAME_FULL } from '../../../../shared/constants';

const UpdateNoticeContainer = styled.div`
  max-width: 360px;
  position: relative;
  border: 2px solid #ff8f34;
  box-sizing: border-box;
  padding: 8px 16px;
  border-radius: 10px;
  color: #000;
  background-color: #fff !important;

  font-family: sans-serif;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  box-shadow: 0 4px 10px 0 rgb(0 0 0 / 20%), 0 4px 20px 0 rgb(0 0 0 / 19%);
  line-height: 22px;
`;

const ExtensionNameContainerSpan = styled.span`
  background-color: rgb(255, 196, 161);
  color: #000;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
`;

const ActionButtonsContainer = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const ActionButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.05s ease-in;
  padding: 4px 8px;
  border-radius: 4px;

  text-decoration: underline;

  &:hover {
    background-color: ${(props) =>
      props.action === 'reload' ? '#198754' : 'gray'};
    color: ${(props) => (props.action === 'reload' ? '#fff' : '#fff')};
    text-decoration: none;
  }
`;

const UpdateNotice = () => {
  const [shouldDisplay, setShouldDisplay] = useState(
    localStorage.getItem('vt-update-notice-dismissed') !== 'true'
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      {shouldDisplay && (
        <UpdateNoticeContainer>
          <div>
            <ExtensionNameContainerSpan>
              {APP_NAME_FULL}
            </ExtensionNameContainerSpan>{' '}
            was just updated! Please refresh the page to use the extension.
            Thanks!
          </div>
          <ActionButtonsContainer>
            <ActionButton
              action={'reload'}
              onClick={() => {
                localStorage.removeItem('vt-update-notice-dismissed');
                window.location.reload();
              }}
            >
              <RefreshIcon size="20px" style={{ marginRight: '4px' }} />
              Refresh Now
            </ActionButton>
            <ActionButton
              action={'dismiss'}
              onClick={() => {
                localStorage.setItem('vt-update-notice-dismissed', 'true');
                setShouldDisplay(false);
              }}
            >
              <DismissIcon size="16px" style={{ marginRight: '4px' }} />
              Dismiss
            </ActionButton>
          </ActionButtonsContainer>
        </UpdateNoticeContainer>
      )}
    </div>
  );
};

export default UpdateNotice;
