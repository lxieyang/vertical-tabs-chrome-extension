import React from 'react';
import { AiFillWarning as WarningIcon } from 'react-icons/ai';
import { detect } from 'detect-browser';
import styled from 'styled-components';

const Container = styled.div`
  width: 220px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  border-radius: 3px;
  padding: 0px;
  text-align: left;
  font-family: sans-serif;
  font-size: 14px !important;
  font-style: normal;
  font-weight: normal;
  line-height: normal !important;
`;

const Title = styled.div`
  padding: 8px 10px;
  background: ${(props) => (props.isDark ? 'rgb(36, 36, 36)' : '#fefefe')};
  color: ${(props) => (props.isDark ? 'rgb(167, 167, 167)' : '#333')};

  border-top-left-radius: 3px;
  border-top-right-radius: 3px;

  word-wrap: break-word;
`;

const Domain = styled.div`
  padding: 8px 10px;
  background: ${(props) => (props.isDark ? '#35363A' : 'rgb(222, 225, 230)')};
  color: ${(props) => (props.isDark ? 'rgb(167, 167, 167)' : '#444')};

  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`;

const DomainNameDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Favicon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 6px;

  flex-shrink: 0;
`;

const DomainName = styled.div`
  flex: 1;
  flex-wrap: nowrap;
  overflow-x: hidden;
`;

const NotSecureBadgeContainer = styled.div`
  margin-top: 8px;
`;

const NotSecureBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;

  padding: 2px 6px;

  border-radius: 50rem !important;
  font-size: 12px;
  background: #dc3545;
  color: #fff;
  font-weight: 500;
`;

const browserInfo = detect();

const TabPreviewFrame = ({ title, url, faviconUrl, isDark }) => {
  let domain = new URL(url).hostname;

  if (url.startsWith(browserInfo.name + '://') && !domain.includes('://')) {
    domain = browserInfo.name + '://' + domain;
  } else if (url.startsWith('file:') && domain.trim().length === 0) {
    domain = 'local or shared file';
  }

  const isNotSecure = url.startsWith('http://');

  return (
    <Container className="TabPreviewContainer">
      <Title isDark={isDark}>{title}</Title>

      <Domain isDark={isDark}>
        <DomainNameDisplay>
          <Favicon src={faviconUrl} />
          <DomainName>{domain}</DomainName>
        </DomainNameDisplay>
        {isNotSecure && (
          <NotSecureBadgeContainer>
            <NotSecureBadge>
              <WarningIcon style={{ fontSize: '14px', marginRight: '5px' }} />
              Not Secure
            </NotSecureBadge>
          </NotSecureBadgeContainer>
        )}
      </Domain>
    </Container>
  );
};

export default TabPreviewFrame;
