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
import { LAYOUT_SCOPE_CLASS } from '../layoutScope';
import ItemBadge from '../ItemBadge';
import useToggleBounce from '../useToggleBounce';

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

const Toolbar = ({ show = true, className, items, activeKey, base = '', onChange, target, minimal = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getScrollElement = useScrollElement();
  const getBoundaryElement = usePopupContainer();
  const { mode } = useResponsiveContext();
  const isMobile = useIsMobile();
  const { scrollReady, bottomBarMerged, bottomBarMode, setBottomBarMode, setBottomBarScrolling } = useContext();
  const docked = !!bottomBarMerged && bottomBarMode === 'footer';
  const shrunk = !!bottomBarMerged && bottomBarMode === 'toolbar';
  const [bouncing, stopBounce] = useToggleBounce(docked);
  const mergedRef = useRef({ docked, shrunk, setBottomBarMode, setBottomBarScrolling });
  mergedRef.current = { docked, shrunk, setBottomBarMode, setBottomBarScrolling };
  const currentPathname = base ? location.pathname.replace(new RegExp(`^${base}`), '') : location.pathname;
  const toolbarMenu = items.filter(item => item.toolbar);
  const itemRefs = useRef([]);
  const firstRenderRef = useRef(true);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, scale: 1, visible: false });
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

  const listRef = useRef(null);
  const explicitTarget = resolveTarget(target);
  const useBoundaryMount = isMobile && mode === 'container' && !explicitTarget;
  const useViewportFixed = isMobile && mode !== 'container' && !explicitTarget;
  const boundaryTarget = useBoundaryMount ? getBoundaryElement() : null;

  useEffect(() => {
    suppressCollapseUntilRef.current = Date.now() + SCROLL_COLLAPSE_SUPPRESS_MS;
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (minimal) {
      firstRenderRef.current = true;
      setIndicator(prev => (prev.visible ? { ...prev, visible: false } : prev));
      return;
    }
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
  }, [activeIndex, show, target, useBoundaryMount, useViewportFixed, minimal, toolbarMenu.length]);

  // 收纳/展开时宽度有过渡，结束后按最终尺寸校准指示器
  const handleListTransitionEnd = e => {
    if (minimal || e.target !== listRef.current || e.propertyName !== 'width' || activeIndex < 0) {
      return;
    }
    const item = itemRefs.current[activeIndex];
    if (!item) {
      return;
    }
    const itemRect = item.getBoundingClientRect();
    const listRect = listRef.current.getBoundingClientRect();
    setIndicator(prev => ({ ...prev, left: itemRect.left - listRect.left, width: itemRect.width, scale: 1, visible: true }));
  };

  useEffect(() => {
    const scrollEl = getScrollElement();
    if (!scrollEl) {
      return;
    }
    const isDocumentScroll = typeof document !== 'undefined' && (scrollEl === document.scrollingElement || scrollEl === document.documentElement || scrollEl === document.body);
    // 与 Page navbar 一致：document/body 滚动在部分环境听 element 不稳定，统一挂 window
    const listenTarget = isDocumentScroll ? window : scrollEl;
    if (!listenTarget || typeof listenTarget.addEventListener !== 'function') {
      return;
    }
    // 滚动态同步写入 context，与切换底栏模式在同一次渲染生效，避免底栏先展开再收起
    const updateScrolling = value => {
      setScrolling(value);
      const setShared = mergedRef.current.setBottomBarScrolling;
      setShared && setShared(value);
    };
    const handleScroll = () => {
      if (Date.now() < suppressCollapseUntilRef.current) {
        return;
      }
      if (readScrollTop(scrollEl) <= 0) {
        updateScrolling(false);
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
        return;
      }
      // 与底栏合并时展开态一滚动就切回底栏模式，滚动中两侧都收成圆钮，停止后底栏再展开
      const merged = mergedRef.current;
      merged.shrunk && merged.setBottomBarMode('footer');
      updateScrolling(true);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      scrollTimerRef.current = setTimeout(() => {
        updateScrolling(false);
      }, 500);
    };

    listenTarget.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      listenTarget.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
      const setShared = mergedRef.current.setBottomBarScrolling;
      setShared && setShared(false);
    };
  }, [getScrollElement, show, scrollReady]);

  // 滚动收缩时不叠加果冻形变：animation 会覆盖缩放的 transform 造成跳动
  useEffect(() => {
    scrolling && bouncing && stopBounce();
  }, [scrolling, bouncing]);

  if (!show) {
    return null;
  }

  const toolbarList = (
    <Flex
      ref={listRef}
      role="navigation"
      aria-label="主导航"
      className={classnames('toolbar-list', style['toolbar-list'], {
        ['is-clicked']: clicked,
        ['is-scrolling']: scrolling,
        ['is-docked']: docked,
        [style['is-docked']]: docked,
        [style['is-shrunk']]: shrunk,
        [style['is-bouncing']]: bouncing && !scrolling,
        [style['is-minimal']]: minimal,
        [style['is-boundary']]: useBoundaryMount,
        [style['is-viewport']]: useViewportFixed
      })}
      style={{
        '--toolbar-count': toolbarMenu.length || 1
      }}
      onAnimationEnd={e => {
        if (clicked) {
          setClicked(false);
        }
        if (e.target === e.currentTarget && bouncing) {
          stopBounce();
        }
      }}
      onTransitionEnd={handleListTransitionEnd}
    >
      {!minimal && indicator.visible && (
        <div
          aria-hidden="true"
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

        const handleItemClick = e => {
          if (docked) {
            suppressScrollCollapse();
            setBottomBarMode('toolbar');
            return;
          }
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
        };

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
            role="link"
            tabIndex={0}
            aria-label={docked ? `${item.label}，展开导航` : item.label}
            aria-current={active ? 'page' : undefined}
            className={classnames('toolbar-item', style['toolbar-item'], {
              ['is-active']: active,
              [style['is-hidden']]: (scrolling || docked) && index !== displayIndex
            })}
            onClick={handleItemClick}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleItemClick(e);
              }
            }}
          >
            <ItemBadge badge={item.badge} className={classnames('toolbar-item-badge', style['toolbar-item-badge'])}>
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
            </ItemBadge>
            {!minimal && <div className={classnames('toolbar-item-label', style['toolbar-item-label'])}>{item.label}</div>}
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
    return <div className={classnames('toolbar', style['toolbar'], className)}>{createPortal(<div className={LAYOUT_SCOPE_CLASS}>{toolbarList}</div>, explicitTarget)}</div>;
  }

  return null;
};

export default Toolbar;
