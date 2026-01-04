import { useState, useEffect } from 'react';
import getIsMobile from './isMobile';
import throttle from 'lodash/throttle';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => getIsMobile());

  useEffect(() => {
    const handler = throttle(() => {
      setIsMobile(getIsMobile());
    }, 500);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
