import React from 'react';

const audioContext = React.createContext({
  mutedHostnames: [],
  muteHostname: () => {},
  unmuteHostname: () => {},
});

export default audioContext;
