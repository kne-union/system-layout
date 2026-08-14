import { createPortal } from 'react-dom';
import { Flex } from 'antd';
import ensureSlash from '@kne/ensure-slash';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@kne/react-icon';
import classnames from 'classnames';
import style from './style.module.scss';
import { isValidElement, useRef, useState, useEffect } from 'react';
import isPlainObject from 'lodash/isPlainObject';
import { useScrollElement, usePopupContainer, useResponsiveContext, useIsMobile } from '@kne/responsive-utils';
import { useContext } from '../context';

const resolveTarget = target => {
  if (!target) {
    return null;
  }
  return typeof target === 'function' ? target() : target;
};

const readScrollTop = scrollEl => {
  if (!scrollEl || typeof document === 'undefined') {
    return 0;
  }
  const isDocumentScroll = scrollEl === document.scrollingElement || scrollEl === document.documentElement || scrollEl === document.body;
  if (isDocumentScroll) {
    return document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
  }
  return scrollEl.scrollTop || 0;
};

const SCROLL_COLLAPSE_SUPPRESS_MS = 500;

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
  const [clicked, setClicked] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const scrollTimerRef = useRef(null);
  const suppressCollapseUntilRef = useRef(0);

  const suppressScrollCollapse = () => {
    suppressCollapseUntilRef.current = Date.now() + SCROLL_COLLAPSE_SUPPRESS_MS;
  };

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

  const explicitTarget = resolveTarget(target);
  const useBoundaryMount = isMobile && mode === 'container' && !explicitTarget;
  const useViewportFixed = isMobile && mode !== 'container' && !explicitTarget;
  const boundaryTarget = useBoundaryMount ? getBoundaryElement() : null;

  useEffect(() => {
    suppressCollapseUntilRef.current = Date.now() + SCROLL_COLLAPSE_SUPPRESS_MS;
  }, [location.pathname]);

  useEffect(() => {
    const scrollEl = getScrollElement();
    if (!scrollEl || typeof scrollEl.addEventListener !== 'function') {
      return;
    }
    const handleScroll = () => {
      if (Date.now() < suppressCollapseUntilRef.current) {
        return;
      }
      if (readScrollTop(scrollEl) <= 0) {
        setScrolling(false);
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
        return;
      }
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
      {toolbarMenu.map((item, index) => {
        const active = index === activeIndex;
        const icon = typeof item.icon === 'function' ? item.icon({ active }) : item.icon;
        return (
          <Flex
            key={item.key || item.path || index}
            vertical
            flex={1}
            justify="center"
            align="center"
            aria-label={item.label}
            className={classnames('toolbar-item', style['toolbar-item'], {
              ['is-active']: active,
              [style['is-hidden']]: scrolling && index !== displayIndex
            })}
            onClick={e => {
              if (active) {
                return;
              }
              suppressScrollCollapse();
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
