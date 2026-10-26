import { Flex, Button, Skeleton } from 'antd';
import { createPortal } from 'react-dom';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '@kne/react-icon';
import ButtonGroup from '@kne/button-group';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useScrollElement, usePopupContainer, useResponsiveContext, RESPONSIVE_CONTAINER_CLASS } from '@kne/responsive-utils';
import { useContext } from '../context';
import style from './style.module.scss';
import { Image } from '@kne/react-file';
import FooterOpenIcon from './FooterOpenIcon';
import MoreIcon from './MoreIcon';
import useToggleBounce from '../useToggleBounce';

const findFooterMount = anchor => {
  if (!anchor) {
    return null;
  }
  const container = anchor.closest(`.${RESPONSIVE_CONTAINER_CLASS}`);
  if (container) {
    return container;
  }
  const pageRoot = anchor.closest('.page');
  if (pageRoot && pageRoot.parentElement) {
    return pageRoot.parentElement.closest('.page');
  }
  return null;
};

const PageFooter = ({ children, className, icon = <FooterOpenIcon /> }) => {
  const anchorRef = useRef(null);
  const footerRef = useRef(null);
  const [host, setHost] = useState(null);
  const { deviceIsMobile, toolbarShow, toolbarMinimal, setPageFooterShow, bottomBarMode, setBottomBarMode, bottomBarScrolling } = useContext();
  const { mode } = useResponsiveContext();
  const getBoundaryElement = usePopupContainer();
  const hasToolbar = !!toolbarShow;
  // 移动端有 Toolbar 时与其合并成同一行，二者通过圆钮互相切换
  const merged = deviceIsMobile && hasToolbar;
  const docked = merged && bottomBarMode === 'toolbar';
  const [bouncing, stopBounce] = useToggleBounce(docked);
  const scrolling = merged && !docked && !!bottomBarScrolling;
  // 滚动收缩时不叠加果冻形变，避免与缩放 transform 冲突
  useEffect(() => {
    bottomBarScrolling && bouncing && stopBounce();
  }, [bottomBarScrolling, bouncing]);
  const useBoundaryMount = deviceIsMobile && mode === 'container';
  const boundaryTarget = useBoundaryMount ? getBoundaryElement() : null;
  const boundaryReady = useBoundaryMount && !!boundaryTarget;
  const useViewportFixed = deviceIsMobile && !boundaryReady;

  useLayoutEffect(() => {
    setHost(findFooterMount(anchorRef.current));
  }, []);

  useEffect(() => {
    if (!setPageFooterShow) {
      return undefined;
    }
    setPageFooterShow(true);
    setBottomBarMode && setBottomBarMode('footer');
    return () => setPageFooterShow(false);
  }, []);

  useLayoutEffect(() => {
    const el = footerRef.current;
    if (!host || !el) {
      return;
    }
    if (merged) {
      // 与 Toolbar 同排，内容区已为 Toolbar 预留底部空间，无需再叠加底栏高度
      el.style.removeProperty('left');
      el.style.removeProperty('width');
      el.style.removeProperty('right');
      host.style.removeProperty('--page-footer-height');
      return;
    }
    const apply = () => {
      if (deviceIsMobile) {
        const hostRect = host.getBoundingClientRect();
        if (boundaryReady && boundaryTarget) {
          const boundRect = boundaryTarget.getBoundingClientRect();
          el.style.left = `${hostRect.left - boundRect.left}px`;
        } else {
          el.style.left = `${hostRect.left}px`;
        }
        el.style.width = `${hostRect.width}px`;
        el.style.right = 'auto';
      }
      host.style.setProperty('--page-footer-height', `${el.getBoundingClientRect().height}px`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    observer.observe(host);
    window.addEventListener('resize', apply);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', apply);
      host.style.removeProperty('--page-footer-height');
    };
  }, [host, merged, deviceIsMobile, toolbarMinimal, boundaryReady, boundaryTarget]);

  const footer = (
    <div
      ref={footerRef}
      className={classnames('page-footer', style['page-footer'], className, {
        'is-mobile': deviceIsMobile,
        [style['is-mobile']]: deviceIsMobile,
        'is-merged': merged,
        [style['is-merged']]: merged,
        'is-docked': docked,
        [style['is-docked']]: docked,
        [style['is-bouncing']]: bouncing && !bottomBarScrolling,
        'is-scrolling': scrolling,
        [style['is-scrolling']]: scrolling,
        'is-viewport': useViewportFixed,
        [style['is-viewport']]: useViewportFixed,
        'is-boundary': boundaryReady,
        [style['is-boundary']]: boundaryReady
      })}
      onAnimationEnd={e => {
        if (e.target === e.currentTarget && bouncing) {
          stopBounce();
        }
      }}
    >
      {merged ? (
        <>
          <div className={classnames('page-footer-content', style['page-footer-content'])} aria-hidden={docked || undefined}>
            {children}
          </div>
          <button type="button" className={classnames('page-footer-dock', style['page-footer-dock'])} aria-label="展开操作栏" tabIndex={docked ? 0 : -1} onClick={() => setBottomBarMode('footer')}>
            {typeof icon === 'string' ? <Icon type={icon} fontClassName="system" /> : icon}
          </button>
        </>
      ) : (
        children
      )}
    </div>
  );

  const portalTarget = boundaryReady ? boundaryTarget : host;
  const node = boundaryReady ? (
    <div
      className={classnames('page-footer-boundary-overlay', style['page-footer-boundary-overlay'])}
      style={{
        '--toolbar-height': hasToolbar ? (toolbarMinimal ? '48px' : '62px') : '0px',
        '--toolbar-bottom-gap': '8px',
        '--safe-area-inset-bottom': 'env(safe-area-inset-bottom)'
      }}
    >
      {footer}
    </div>
  ) : (
    footer
  );

  return (
    <>
      <span ref={anchorRef} className={style['page-footer-anchor']} />
      {portalTarget ? createPortal(node, portalTarget) : null}
    </>
  );
};

const PageLoading = () => {
  return (
    <Flex flex={1} justify="center">
      <div className={style['page-loading']}>
        <Skeleton active />
      </div>
    </Flex>
  );
};

const Page = ({ title, extra = null, back, buttonProps, children, toolbar = true, navbar = true, noPadding }) => {
  const { setToolbarShow, setNavbarShow, setMenuOpen, deviceIsMobile, userAvatar, scrollReady } = useContext();
  const navigate = useNavigate();
  const getScrollElement = useScrollElement();
  const getBoundaryElement = usePopupContainer();
  const { mode } = useResponsiveContext();
  const navbarRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const useBoundaryMount = deviceIsMobile && mode === 'container';
  const useViewportFixed = deviceIsMobile && mode !== 'container';
  const boundaryTarget = useBoundaryMount ? getBoundaryElement() : null;

  useEffect(() => {
    setToolbarShow && setToolbarShow(!!toolbar);
    setNavbarShow && setNavbarShow(!!navbar);
  }, [toolbar, navbar]);

  useEffect(() => {
    if (!deviceIsMobile || !navbar) {
      return;
    }
    let boundKey = null;
    let remove = null;

    const bind = () => {
      const scrollEl = getScrollElement();
      if (!scrollEl) {
        return;
      }
      const isDocumentScroll = typeof document !== 'undefined' && (scrollEl === document.scrollingElement || scrollEl === document.documentElement || scrollEl === document.body);
      // document 滚动在部分环境听 element 不稳定，统一挂 window
      const listenTarget = isDocumentScroll ? window : scrollEl;
      if (!listenTarget || typeof listenTarget.addEventListener !== 'function') {
        return;
      }
      const nextKey = isDocumentScroll ? 'window' : scrollEl;
      if (nextKey === boundKey) {
        return;
      }
      if (typeof remove === 'function') {
        remove();
      }
      boundKey = nextKey;
      const readScrollTop = () => {
        if (isDocumentScroll) {
          return document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
        }
        return scrollEl.scrollTop || 0;
      };
      const handleScroll = () => {
        const threshold = navbarRef.current ? navbarRef.current.offsetHeight : 48;
        setIsScrolled(readScrollTop() > threshold);
      };
      handleScroll();
      listenTarget.addEventListener('scroll', handleScroll, { passive: true });
      remove = () => listenTarget.removeEventListener('scroll', handleScroll);
    };

    bind();
    // SimpleBar / kne-responsive-scroll 可能在下一帧才就绪，补一次绑定
    const raf = requestAnimationFrame(bind);
    return () => {
      cancelAnimationFrame(raf);
      if (typeof remove === 'function') {
        remove();
      }
    };
  }, [deviceIsMobile, navbar, getScrollElement, scrollReady]);

  // 移动端右侧：自定义 extra 放玻璃胶囊，buttonProps 全部收进「更多」圆钮；
  // 头像圆钮始终显示并可打开菜单，保证带返回键的二级页也有菜单入口
  const extraRef = useRef(null);
  const [extraEmpty, setExtraEmpty] = useState(false);
  const hasMobileActions = deviceIsMobile && !extra && !!buttonProps && (buttonProps.list || []).some(item => item && !item.hidden);
  const titleExtraContent = (() => {
    if (!deviceIsMobile) {
      return extra || (buttonProps ? <ButtonGroup {...buttonProps} /> : null);
    }
    return (
      <>
        {extra ? (
          <div ref={extraRef} className={classnames('page-nav-capsule', style['nav-capsule'], { [style['is-empty']]: extraEmpty })}>
            {extra}
          </div>
        ) : null}
        {hasMobileActions ? (
          <ButtonGroup
            {...buttonProps}
            showLength={0}
            placement="bottomRight"
            getPopupContainer={buttonProps.getPopupContainer || (() => getBoundaryElement() || document.body)}
            more={<Button type="text" className={classnames('page-nav-circle', style['nav-circle'])} icon={<MoreIcon />} aria-label="more" />}
          />
        ) : null}
        <Button
          type="text"
          className={classnames('page-nav-circle', style['nav-circle'], style['nav-avatar'])}
          aria-label="打开菜单"
          onClick={() => {
            setMenuOpen(true);
          }}
        >
          <Image.Avatar id={userAvatar} src={userAvatar} shape="circle" size={34} alt="avatar" />
        </Button>
      </>
    );
  })();

  // nav 左侧是否有内容：移动端始终有菜单/返回键；桌面端无返回键且无标题时左侧为空，
  // 滚动后 page-title-outer 会显示为胶囊，空内容时不渲染，避免出现空容器
  const hasNavbarLeft = !!(title || back || deviceIsMobile);

  // 自定义 extra 渲染结果可能为空（包装节点内为 null），胶囊仍带边框/毛玻璃底，实测为空则隐藏
  useLayoutEffect(() => {
    const el = extraRef.current;
    if (!el) {
      setExtraEmpty(false);
      return;
    }
    // 有文本，或任一直接子节点可见（宽高非 0）即视为非空
    let hasVisible = !!el.textContent.trim();
    for (const child of el.children) {
      const rect = child.getBoundingClientRect();
      if (rect.width > 1 || rect.height > 1) {
        hasVisible = true;
        break;
      }
    }
    setExtraEmpty(!hasVisible);
  });

  const navbarInner = navbar ? (
    <Flex
      ref={navbarRef}
      justify="space-between"
      align="center"
      gap={20}
      className={classnames('page-header', style['page-header'], {
        ['is-mobile']: deviceIsMobile,
        [style['is-mobile']]: deviceIsMobile,
        ['is-scrolled']: isScrolled,
        [style['is-scrolled']]: isScrolled,
        [style['is-boundary']]: useBoundaryMount && !!boundaryTarget,
        [style['is-viewport']]: useViewportFixed || (useBoundaryMount && !boundaryTarget)
      })}
    >
      {hasNavbarLeft ? (
        <Flex className={classnames('page-title-outer', style['page-title-outer'])} align="center" gap={4}>
          {back && (
            <Button
              type="link"
              icon={<Icon className={style['back-icon']} type="a-Typearrow_forward_ios" fontClassName="system" />}
              onClick={() => {
                navigate(-1);
              }}
            />
          )}
          {!back && deviceIsMobile && (
            <Button
              type="link"
              icon={<Icon className={style['back-icon']} type="a-Typeequal" fontClassName="system" />}
              onClick={() => {
                setMenuOpen(open => !open);
              }}
            />
          )}
          <div className={classnames('page-title', style['page-title'])}>{title}</div>
        </Flex>
      ) : null}
      {titleExtraContent ? <div className={classnames('page-title-extra', style['page-title-extra'])}>{titleExtraContent}</div> : null}
    </Flex>
  ) : null;

  const navbarEl =
    navbarInner && useBoundaryMount && boundaryTarget
      ? createPortal(
          <div
            className={classnames('page-header-boundary-overlay', style['page-header-boundary-overlay'])}
            style={{
              '--safe-area-inset-top': 'env(safe-area-inset-top)',
              '--safe-area-inset-bottom': 'env(safe-area-inset-bottom)'
            }}
          >
            {navbarInner}
          </div>,
          boundaryTarget
        )
      : navbarInner;

  const pageInnerClassNameOrigin = classnames('page-inner', style['page-inner']);
  const pageInnerClassName = classnames(pageInnerClassNameOrigin, {
    ['no-padding']: noPadding,
    [style['no-padding']]: noPadding
  });

  const render = ({ children, className }) => {
    return (
      <>
        <div className={style['page-top']} />
        <Flex vertical flex={1}>
          {navbarEl}
          <Flex vertical flex={1} className={classnames(pageInnerClassNameOrigin, className)}>
            {children}
          </Flex>
        </Flex>
        <div className={style['page-bottom']} />
      </>
    );
  };

  return (
    <Flex
      vertical
      flex={1}
      className={classnames('page', style['page'], {
        ['is-mobile']: deviceIsMobile,
        [style['is-mobile']]: deviceIsMobile
      })}
    >
      {typeof children === 'function'
        ? children({
            navbar: navbarEl,
            className: pageInnerClassName,
            render,
            pageLoading: render({
              children: <PageLoading />
            })
          })
        : render({ children })}
    </Flex>
  );
};

Page.PageLoading = PageLoading;
Page.Footer = PageFooter;

export default Page;
