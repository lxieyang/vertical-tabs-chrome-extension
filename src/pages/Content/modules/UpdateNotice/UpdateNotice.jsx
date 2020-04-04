import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSyncAlt, FaTimesCircle } from 'react-icons/fa';
import { APP_NAME_FULL } from '../../../../shared/constants';

const UpdateNoticeContainer = styled.div`
  max-width: 560px;
  position: relative;
  background-color: #fff;
  border: 1px solid #ffb74d;
  padding: 8px 8px;
  border-radius: 4px;
  color: #000;
  background-color: #fff3e0;

  font-family: sans-serif;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  font-style: normal;
  box-shadow: 0 1px 6px 0 rgba(32, 33, 36, 0.28);
`;

const ExtensionNameContainerSpan = styled.span`
  background-color: rgb(233, 115, 46);
  color: #fff;
  padding: 2px 4px;
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
  padding: 2px 6px;
  border-radius: 4px;

  &:hover {
    background-color: rgb(233, 115, 46);
    color: #fff;
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
        bottom: 5,
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
              onClick={() => {
                localStorage.removeItem('vt-update-notice-dismissed');
                window.location.reload();
              }}
            >
              <FaSyncAlt size="12px" style={{ marginRight: '4px' }} />
              Refresh Now
            </ActionButton>
            <ActionButton
              onClick={() => {
                localStorage.setItem('vt-update-notice-dismissed', 'true');
                setShouldDisplay(false);
              }}
            >
              <FaTimesCircle size="12px" style={{ marginRight: '4px' }} />
              Dismiss
            </ActionButton>
          </ActionButtonsContainer>
        </UpdateNoticeContainer>
      )}
    </div>
  );
};

export default UpdateNotice;
