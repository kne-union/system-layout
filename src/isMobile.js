const isMobile = () => {
  return /iPhone|iPod|Android|ios|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
};

export default isMobile;
