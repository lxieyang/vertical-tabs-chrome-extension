import React from 'react';

const darkModeContext = React.createContext({
  shouldFollowSystemDarkMode: false,
  isDark: false,
  setDarkStatus: () => {},
});

export default darkModeContext;
