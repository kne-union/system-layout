import { IS_MOBILE_QUERY, MOBILE_BREAKPOINT } from '@kne/responsive-utils';

const isMobile = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia(IS_MOBILE_QUERY).matches;
};

export default isMobile;
export { MOBILE_BREAKPOINT };
