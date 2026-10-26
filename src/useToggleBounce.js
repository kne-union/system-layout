import { useEffect, useRef, useState } from 'react';

// value 变化时返回 bouncing=true，动画结束后调用 stop 复位；首次渲染不触发
const useToggleBounce = value => {
  const prevRef = useRef(value);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    if (prevRef.current === value) {
      return;
    }
    prevRef.current = value;
    setBouncing(true);
  }, [value]);

  return [bouncing, () => setBouncing(false)];
};

export default useToggleBounce;
