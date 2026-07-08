import { createPortal } from 'react-dom';
import { Flex } from 'antd';
import ensureSlash from '@kne/ensure-slash';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@kne/react-icon';
import classnames from 'classnames';
import style from './style.module.scss';
import { isValidElement, useRef, useLayoutEffect, useState, useEffect } from 'react';
import isPlainObject from 'lodash/isPlainObject';
import { useScrollElement, usePopupContainer, useResponsiveContext, useIsMobile } from '@kne/responsive-utils';
import { useContext } from '../context';

const resolveTarget = target => {
  if (!target) {
    return null;
  }
  return typeof target === 'function' ? target() : target;
};

const Toolbar = ({ show = true, className, items, activeKey, base = '', onChange, target }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getScrollElement = useScrollElement();
  const getBoundaryElement = usePopupContainer();
  const { mode } = useResponsiveContext();
  const isMobile = useIsMobile();
  const { scrollReady } = useContext();
  const currentPathname = base ? location.pathname.replace(new RegExp(`^${base}`), '') : location.pathname;
  const toolbarMenu = items.filter(item => item.toolbar);
  const itemRefs = useRef([]);
  const firstRenderRef = useRef(true);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, scale: 1, visible: false });
  const [clicked, setClicked] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimerRef = useRef(null);

  const activeIndex = toolbarMenu.findIndex(item => {
    if (typeof activeKey === 'string') {
      return activeKey === item.key;
    }
    if (typeof activeKey === 'function') {
      return activeKey(item, { base });
    }
    if (typeof item.path === 'string') {
      return ensureSlash(currentPathname) === ensureSlash(item.path);
    }
    return false;
  });
  const displayIndex = activeIndex >= 0 ? activeIndex : 0;

  const listRef = useRef(null);
  const explicitTarget = resolveTarget(target);
  const useBoundaryMount = isMobile && mode === 'container' && !explicitTarget;
  const useViewportFixed = isMobile && mode !== 'container' && !explicitTarget;
  const boundaryTarget = useBoundaryMount ? getBoundaryElement() : null;

  useLayoutEffect(() => {
    if (activeIndex < 0) {
      return;
    }
    const item = itemRefs.current[activeIndex];
    const list = listRef.current;
    if (!item || !list) {
      return;
    }

    const itemRect = item.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const newLeft = itemRect.left - listRect.left;
    const newWidth = itemRect.width;

    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      setIndicator({ left: newLeft, width: newWidth, scale: 1, visible: true });
      return;
    }

    setIndicator(prev => ({ ...prev, scale: 1.15 }));

    const t1 = setTimeout(() => {
      setIndicator(prev => ({ ...prev, left: newLeft, width: newWidth }));
    }, 120);

    const t2 = setTimeout(() => {
      setIndicator(prev => ({ ...prev, scale: 1 }));
    }, 380);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeIndex, show, target, useBoundaryMount, useViewportFixed]);

  useEffect(() => {
    const scrollEl = getScrollElement();
    if (!scrollEl || typeof scrollEl.addEventListener !== 'function') {
      return;
    }
    const handleScroll = () => {
      setScrolling(true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = setTimeout(() => {
        setScrolling(false);
      }, 500);
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [getScrollElement, show, scrollReady]);

  if (!show) {
    return null;
  }

  const toolbarList = (
    <Flex
      ref={listRef}
      className={classnames('toolbar-list', style['toolbar-list'], {
        ['is-clicked']: clicked,
        ['is-scrolling']: scrolling,
        [style['is-boundary']]: useBoundaryMount,
        [style['is-viewport']]: useViewportFixed
      })}
      style={{
        '--toolbar-count': toolbarMenu.length || 1
      }}
      onAnimationEnd={() => {
        if (clicked) {
          setClicked(false);
        }
      }}
    >
      {indicator.visible && (
        <div
          className={classnames('toolbar-indicator', style['toolbar-indicator'])}
          style={{
            left: `${indicator.left}px`,
            width: `${indicator.width}px`,
            transform: `scale(${indicator.scale})`
          }}
        />
      )}
      {toolbarMenu.map((item, index) => {
        const active = index === activeIndex;
        const icon = typeof item.icon === 'function' ? item.icon({ active }) : item.icon;
        return (
          <Flex
            key={item.key || item.path || index}
            ref={el => {
              itemRefs.current[index] = el;
            }}
            vertical
            flex={1}
            justify="center"
            align="center"
            className={classnames('toolbar-item', style['toolbar-item'], {
              ['is-active']: active,
              [style['is-hidden']]: scrolling && index !== displayIndex
            })}
            onClick={e => {
              if (active) {
                return;
              }
              setClicked(true);
              onChange && onChange(item, { base });
              if (typeof item.onClick === 'function') {
                item.onClick(item, { base, event: e });
                return;
              }
              if (item.path) {
                navigate(ensureSlash(`${base}${item.path}`));
              }
            }}
          >
            {(icon => {
              if (typeof icon === 'string') {
                return <Icon className={classnames('toolbar-item-icon', style['toolbar-item-icon'])} type={icon} fontClassName="system" />;
              }

              if (isValidElement(icon)) {
                return <span className={classnames('toolbar-item-icon', style['toolbar-item-icon'])}>{icon}</span>;
              }

              if (isPlainObject(icon) && typeof icon.type === 'string') {
                return <Icon {...icon} className={classnames('toolbar-item-icon', style['toolbar-item-icon'])} />;
              }

              return null;
            })(icon)}
            <div className={classnames('toolbar-item-label', style['toolbar-item-label'])}>{item.label}</div>
          </Flex>
        );
      })}
    </Flex>
  );

  if (useBoundaryMount && boundaryTarget) {
    return <div className={classnames('toolbar', style['toolbar'], className)}>{createPortal(<div className={classnames('toolbar-boundary-overlay', style['toolbar-boundary-overlay'])}>{toolbarList}</div>, boundaryTarget)}</div>;
  }

  if (useViewportFixed) {
    return <div className={classnames('toolbar', style['toolbar'], style['toolbar-inline'], className)}>{toolbarList}</div>;
  }

  if (explicitTarget) {
    return <div className={classnames('toolbar', style['toolbar'], className)}>{createPortal(toolbarList, explicitTarget)}</div>;
  }

  return null;
};

export default Toolbar;
