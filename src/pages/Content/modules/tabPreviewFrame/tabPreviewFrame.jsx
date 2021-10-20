import React from 'react';
import { detect } from 'detect-browser';
import styled from 'styled-components';

const Container = styled.div`
  width: 220px;
  max-height: 200px;
  font-family: sans-serif;
  font-size: 14px !important;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 16%), 0 2px 10px 0 rgb(0 0 0 / 12%);
  border-radius: 3px;
  padding: 0px;
`;

const Title = styled.div`
  padding: 8px 10px;
  background: ${(props) => (props.isDark ? 'rgb(36, 36, 36)' : '#fefefe')};
  color: ${(props) => (props.isDark ? 'rgb(167, 167, 167)' : '#333')};

  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
`;

const Domain = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 8px 10px;
  background: ${(props) => (props.isDark ? '#35363A' : 'rgb(222, 225, 230)')};
  color: ${(props) => (props.isDark ? 'rgb(167, 167, 167)' : '#444')};

  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
`;

const Favicon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 6px;
`;

const DomainName = styled.div``;

const browserInfo = detect();

const TabPreviewFrame = ({ id, title, url, faviconUrl, isDark }) => {
  let domain = new URL(url).hostname;

  if (domain.toLocaleLowerCase() === 'newtab') {
    domain = browserInfo.name + '://newtab';
  } else if (domain.trim().length === 0) {
    if (url.startsWith('file:')) {
      domain = 'local or shared file';
    }
  }

  return (
    <Container className="TabPreviewContainer">
      <Title isDark={isDark}>{title}</Title>

      <Domain isDark={isDark}>
        <Favicon src={faviconUrl} />
        <DomainName>{domain}</DomainName>
      </Domain>
    </Container>
  );
};

export default TabPreviewFrame;
