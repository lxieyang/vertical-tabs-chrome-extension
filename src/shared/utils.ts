import { useEffect, useRef } from 'react';

export const getFavicon = (url: string) => {
  return `chrome://favicon/size/16@2x/${url}`;
};

export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
