import React from 'react';

const darkModeContext = React.createContext({
  mediaQueryDark: false,
  isDark: false,
  setDarkStatus: () => {},
});

export default darkModeContext;
