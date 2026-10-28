import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Flex, Row, Col, ConfigProvider } from 'antd';
import classnames from 'classnames';
import localStorage from '@kne/local-storage';
import { Image } from '@kne/react-file';
import UserCard from './UserCard';
import Menu from '../Menu';
import Toolbar from '../Toolbar';
import Icon from '@kne/react-icon';
import defaultLogo from './defaultLogo.svg';
import { ReactComponent as ExpandIcon } from './expand.svg';
import style from './style.module.scss';
import ErrorBoundary from '../ErrorComponent';
import SimpleBar from 'simplebar-react';
import { Provider } from '../context';
import { LAYOUT_SCOPE_CLASS, syncLayoutScope, clearLayoutScope } from '../layoutScope';
import { useLocation } from 'react-router-dom';
import useIsMobile from '../useIsMobile';
import { ResponsiveProvider, useResponsiveContext, findResponsiveScroll, findScrollParent, getDefaultScrollElement, RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_CONTAINER_CLASS, RESPONSIVE_SCROLL_CLASS } from '@kne/responsive-utils';
import 'simplebar-react/dist/simplebar.min.css';

// 正文 15px 提升可读性；large 控件字号固定 16px，避免 iOS 聚焦输入框缩放页面
const MOBILE_THEME = { token: { fontSize: 15, fontSizeLG: 16 } };

const normalizeMarkedScrollElement = marked => {
  if (!marked) {
    return null;
  }
  if (typeof marked.getScrollElement === 'function') {
    const fromApi = marked.getScrollElement();
    if (fromApi) {
      return fromApi;
    }
  }
  if (marked.nodeType === 1) {
    const wrapper = marked.querySelector('.simplebar-content-wrapper');
    if (wrapper) {
      return wrapper;
    }
  }
  return marked;
};

const resolveDocumentScrollElement = () => {
  if (typeof document === 'undefined') {
    return null;
  }
  // 真实移动端滚 document，不要走 getDefaultScrollElement：
  // 它会 document.querySelector(.kne-responsive-scroll)，容易绑到宿主页无关节点。
  return document.scrollingElement || document.documentElement || document.body || null;
};

const resolvePageScrollElement = (pageScrollRef, openScrollbar, deviceIsMobile) => {
  if (deviceIsMobile && !openScrollbar) {
    const anchor = pageScrollRef.current;
    if (anchor) {
      // 优先真实可滚祖先（example 手机外框 SimpleBar content-wrapper）
      const scrollParent = findScrollParent(anchor);
      if (scrollParent) {
        return scrollParent;
      }
      // class 标记的外层可能不是滚动节点，需归一到 content-wrapper
      const marked = normalizeMarkedScrollElement(findResponsiveScroll(anchor.parentElement || anchor));
      if (marked) {
        return marked;
      }
    }
    return resolveDocumentScrollElement();
  }
  const anchor = pageScrollRef.current;
  if (anchor && typeof anchor.getScrollElement === 'function') {
    return anchor.getScrollElement();
  }
  if (anchor && anchor.nodeType === 1 && openScrollbar) {
    const wrapper = anchor.querySelector('.simplebar-content-wrapper');
    if (wrapper) {
      return wrapper;
    }
  }
  return findResponsiveScroll(anchor) || getDefaultScrollElement();
};

// 始终覆盖本页 scroller（否则嵌套在 Global 下 sticky 会绑到 body）。
// container 模式（example 手机外框）保留外层 boundary，toolbar/menu 才能 portal 到
// .example-driver-device-scroll（非滚动内容区），absolute/fixed 相对手机视口生效。
const LayoutResponsiveScope = ({ boundaryRef, scrollRef, getScrollElement, children }) => {
  const parent = useResponsiveContext();
  const inheritBoundary = parent.mode === 'container';
  return (
    <ResponsiveProvider
      mode={parent.mode}
      containerWidth={parent.containerWidth}
      boundaryRef={boundaryRef}
      scrollRef={scrollRef}
      getScrollElement={getScrollElement}
      getBoundaryElement={
        inheritBoundary
          ? () => {
              const fromParent = typeof parent.getBoundaryElement === 'function' ? parent.getBoundaryElement() : null;
              return fromParent || null;
            }
          : undefined
      }
    >
      {children}
    </ResponsiveProvider>
  );
};

const LayoutMenuOpenKey = 'LAYOUT_MENU_OPEN';

const DRAG_THRESHOLD = 4;

// logo 加载失败探针：react-file 的 Image 组件加载失败时会渲染 error 节点，
// 借此感知失败并把 logo 置空，使失败态与「不显示」完全一致
const LogoErrorCatcher = ({ onError }) => {
  useEffect(() => {
    onError && onError();
    return undefined;
  }, []);
  return null;
};

const MobileAiEntry = ({ variant, onOpen }) => {
  const btnRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState(null);

  const handlePointerDown = event => {
    const node = btnRef.current;
    if (!node) {
      return;
    }
    // 与 toolbar 一致：boundary 模式下相对定位容器为 offsetParent，viewport 模式下相对视口
    const container = node.offsetParent;
    const rect = node.getBoundingClientRect();
    const refLeft = container ? container.getBoundingClientRect().left : 0;
    const refTop = container ? container.getBoundingClientRect().top : 0;
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originLeft: rect.left - refLeft,
      originTop: rect.top - refTop,
      refWidth: container ? container.clientWidth : window.innerWidth,
      refHeight: container ? container.clientHeight : window.innerHeight,
      size: node.offsetWidth,
      moved: false
    };
    node.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = event => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      drag.moved = true;
    }
    const maxLeft = Math.max(8, drag.refWidth - drag.size - 8);
    const maxTop = Math.max(8, drag.refHeight - drag.size - 8);
    setPos({
      left: Math.min(Math.max(8, drag.originLeft + dx), maxLeft),
      top: Math.min(Math.max(8, drag.originTop + dy), maxTop)
    });
  };

  const handlePointerUp = event => {
    const drag = dragRef.current;
    dragRef.current = null;
    btnRef.current?.releasePointerCapture?.(event.pointerId);
    if (drag && !drag.moved) {
      onOpen();
    }
  };

  return (
    <div
      ref={btnRef}
      aria-label="打开 AI 助手"
      className={classnames('ai-entry-mobile', style['ai-entry-mobile'], {
        [style['is-viewport']]: variant === 'viewport',
        [style['is-boundary']]: variant !== 'viewport'
      })}
      style={pos ? { left: `${pos.left}px`, top: `${pos.top}px`, right: 'auto', bottom: 'auto' } : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Icon type="system-prompt" colorful />
    </div>
  );
};

const Layout = ({
  className,
  menu,
  background = 'linear-gradient(0deg, #BBCFE7 0%, #BBCFE7 100%), #FFFFFF',
  // 布局外层留白宽度（.layout 的 padding），默认 12。
  // 支持数字（按 px 处理）或任意 CSS 宽度值（如 '16px'、'2vw'）；超过默认值的部分对称分配到最左侧与菜单↔页面间距，
  // padding 为 0 时页面容器全出血并去掉圆角，移动端固定为 0
  padding = 12,
  menuMaxWidth = '254px',
  menuMinWidth = '84px',
  logo,
  menuHeader,
  userInfo,
  aiDialog = null,
  openScrollbar: openScrollbarProps,
  isMobile: isMobileProps,
  toolbarTarget,
  toolbarMinimal = false,
  children
}) => {
  const localMenuOpen = localStorage.getItem(LayoutMenuOpenKey);
  const isMobile = useIsMobile();
  const responsiveContext = useResponsiveContext();
  const deviceIsMobile = typeof isMobileProps === 'boolean' ? isMobileProps : isMobile;
  const useMenuPortal = deviceIsMobile && responsiveContext.mode === 'container';
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);
  const [menuOpen, setMenuOpen] = useState(typeof localMenuOpen === 'boolean' && !deviceIsMobile ? localMenuOpen : !deviceIsMobile);
  const [toolbarShow, setToolbarShow] = useState(true);
  const [navbarShow, setNavbarShow] = useState(true);
  const [aiType, setAiType] = useState('closed');
  const [scrollReady, setScrollReady] = useState(0);
  const [logoLoadFailed, setLogoLoadFailed] = useState(false);
  const [pageFooterShow, setPageFooterShow] = useState(false);
  // 移动端 Toolbar 与 Page.Footer 共用底部一行：footer 模式 Toolbar 收成圆钮，toolbar 模式底栏收成圆钮
  const [bottomBarMode, setBottomBarMode] = useState('footer');
  // 合并态滚动中：Toolbar 圆钮与底栏一起缩小，停止滚动后放开
  const [bottomBarScrolling, setBottomBarScrolling] = useState(false);
  const openScrollbar = typeof openScrollbarProps === 'boolean' ? openScrollbarProps : !deviceIsMobile && !window.__COMPONENTS_CORE_SIMPLE_BAR_DISABLED;
  // 移动端页面不在 layout 内滚动，layout 会被内容撑高，不能作为弹层 boundary：
  // 带上 boundary class 会被 responsive-utils 当成示例手机框，弹层按 absolute 挂到 layout 底部而跑出可视区
  const layoutIsBoundary = !(deviceIsMobile && !openScrollbar);
  // padding 为 0 时页面容器全出血，去掉圆角
  const isZeroPadding = (typeof padding === 'number' ? padding : parseFloat(padding)) === 0;
  const userAvatar = userInfo?.avatar;
  const handleLogoError = useCallback(() => {
    setLogoLoadFailed(true);
  }, []);
  // logo 指向变化时重置失败态（用 src/id 原始值做 key，避免 logo 对象引用不稳定导致重置循环）
  const logoKey = logo && (logo.src || logo.id);
  const lastLogoKeyRef = useRef(logoKey);
  useEffect(() => {
    if (lastLogoKeyRef.current !== logoKey) {
      lastLogoKeyRef.current = logoKey;
      setLogoLoadFailed(false);
    }
  }, [logoKey]);
  const contextValue = useMemo(() => {
    return {
      setToolbarShow,
      setNavbarShow,
      setMenuOpen,
      deviceIsMobile,
      scrollReady,
      toolbarShow: deviceIsMobile && toolbarShow,
      toolbarMinimal: deviceIsMobile && toolbarShow && toolbarMinimal,
      setPageFooterShow,
      bottomBarMerged: deviceIsMobile && toolbarShow && pageFooterShow,
      bottomBarMode,
      setBottomBarMode,
      bottomBarScrolling,
      setBottomBarScrolling,
      logo: logoLoadFailed ? null : logo === undefined ? { src: defaultLogo } : logo && (logo.src || logo.id) ? Object.assign({}, logo, { error: <LogoErrorCatcher onError={handleLogoError} /> }) : null,
      userAvatar
    };
  }, [deviceIsMobile, logo, logoLoadFailed, handleLogoError, userAvatar, scrollReady, toolbarShow, toolbarMinimal, pageFooterShow, bottomBarMode, bottomBarScrolling]);
  const topRef = useRef(null);
  const pageRef = useRef(null);
  const layoutBoundaryRef = useRef(null);
  const pageScrollRef = useRef(null);

  useEffect(() => {
    if (responsiveContext.mode !== 'container' || typeof responsiveContext.getBoundaryElement !== 'function') {
      return undefined;
    }
    const boundary = responsiveContext.getBoundaryElement();
    if (!boundary || boundary === layoutBoundaryRef.current) {
      return undefined;
    }
    syncLayoutScope(boundary, layoutBoundaryRef.current);
    return () => clearLayoutScope(boundary);
  }, [responsiveContext.mode, responsiveContext.getBoundaryElement, deviceIsMobile, toolbarShow, toolbarMinimal, background, scrollReady]);
  const location = useLocation();
  const getPageScrollElement = useCallback(() => {
    return resolvePageScrollElement(pageScrollRef, openScrollbar, deviceIsMobile);
  }, [openScrollbar, deviceIsMobile]);

  const handlePageScrollRef = useCallback(node => {
    pageScrollRef.current = node;
    if (node) {
      setScrollReady(version => version + 1);
    }
  }, []);

  useEffect(() => {
    if (!useMenuPortal) {
      setMenuPortalTarget(null);
      return;
    }
    const target = typeof responsiveContext.getBoundaryElement === 'function' ? responsiveContext.getBoundaryElement() : null;
    setMenuPortalTarget(target || null);
  }, [useMenuPortal, responsiveContext, scrollReady]);

  // 移动端抽屉菜单打开时支持 Esc 关闭（外接键盘场景）
  useEffect(() => {
    if (!deviceIsMobile || !menuOpen) {
      return undefined;
    }
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deviceIsMobile, menuOpen]);

  useEffect(() => {
    const scrollEl = getPageScrollElement();
    if (scrollEl && typeof scrollEl.scrollTo === 'function') {
      scrollEl.scrollTo(0, 0);
      return;
    }
    topRef.current?.scrollIntoView();
  }, [location, getPageScrollElement]);

  const userCard = <UserCard menuOpen={menuOpen} {...Object.assign({}, userInfo)} />;

  const toggleMenuOpen = useCallback(() => {
    setMenuOpen(menuOpen => {
      localStorage.setItem(LayoutMenuOpenKey, !menuOpen);
      return !menuOpen;
    });
  }, []);

  const menuPortalVars = useMenuPortal
    ? {
        '--menu-max-width': menuMaxWidth,
        '--menu-min-width': menuMinWidth,
        '--background': background
      }
    : undefined;

  const layerMenuNode = deviceIsMobile ? (
    <div
      className={classnames('layer-menu', style['layer-menu'], {
        ['open']: menuOpen,
        [style['open']]: menuOpen,
        [style['is-portaled']]: useMenuPortal
      })}
      style={menuPortalVars}
      aria-hidden="true"
      onClick={() => {
        setMenuOpen(false);
      }}
    />
  ) : null;

  const menuNode = (
    <div
      className={classnames('menu', style['menu'], {
        ['open']: menuOpen,
        [style['open']]: menuOpen,
        [style['is-portaled']]: useMenuPortal
      })}
      style={menuPortalVars}
    >
      <div className={classnames('logo', style['logo'], { [style['is-empty']]: !contextValue.logo })}>
        {contextValue.logo ? (
          <span
            className={classnames('logo-img', style['logo-img'])}
            // 收起态点击 logo 直接展开菜单，解决触屏设备无法发现展开按钮的问题
            onClick={!menuOpen ? toggleMenuOpen : undefined}
          >
            <Image {...contextValue.logo} />
          </span>
        ) : null}
        <div
          className={classnames('expand-btn-wrapper', style['expand-btn-wrapper'])}
          role="button"
          tabIndex={0}
          aria-label={menuOpen ? '收起菜单' : '展开菜单'}
          aria-expanded={menuOpen}
          onClick={event => {
            event.stopPropagation();
            toggleMenuOpen();
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              event.stopPropagation();
              toggleMenuOpen();
            }
          }}
        >
          <ExpandIcon className={classnames('expand-btn', style['expand-btn'])} />
        </div>
      </div>
      <div className={classnames('menu-inner', style['menu-inner'])}>
        <div className={classnames('menu-header', style['menu-header'])}>
          <ErrorBoundary>{menuHeader ? (typeof menuHeader === 'function' ? menuHeader({ menuOpen, userCard }) : menuHeader) : userCard}</ErrorBoundary>
        </div>
        <ErrorBoundary>
          <Menu
            className={classnames('menu-list', style['menu-list'])}
            menuOpen={menuOpen}
            {...menu}
            onChange={() => {
              deviceIsMobile && setMenuOpen(false);
            }}
          />
        </ErrorBoundary>
        {aiDialog && !deviceIsMobile && (
          <div
            className={classnames('ai-entry', style['ai-entry'])}
            role="button"
            tabIndex={0}
            aria-label="打开 AI 助手"
            onClick={() => {
              setAiType('small');
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setAiType('small');
              }
            }}
          >
            <Icon type="system-prompt" colorful />
          </div>
        )}
      </div>
    </div>
  );

  const portalMenu = useMenuPortal && menuPortalTarget;

  const aiDialogWindow =
    aiDialog && aiType === 'small' ? (
      <div
        className={classnames('ai-dialog-window', style['ai-dialog-window'], {
          'is-mobile-full': deviceIsMobile,
          [style['is-mobile-full']]: deviceIsMobile,
          [style['is-viewport']]: deviceIsMobile && !portalMenu
        })}
        role="dialog"
        aria-label={aiDialog.title}
        aria-modal={deviceIsMobile || undefined}
      >
        <Flex className={classnames('ai-dialog-window-title', style['ai-dialog-window-title'])}>
          <div>{aiDialog.title}</div>
          <Flex gap={10}>
            {!deviceIsMobile && (
              <Icon
                className="btn"
                type="icon-a-Typeopen_in_full"
                fontClassName="system"
                aria-label="放大"
                onClick={() => {
                  setAiType('inner');
                }}
              />
            )}
            <Icon
              className="btn"
              type="icon-a-Typeclose"
              fontClassName="system"
              aria-label="关闭"
              onClick={() => {
                setAiType('closed');
              }}
            />
          </Flex>
        </Flex>
        <ErrorBoundary>
          <div className={classnames('ai-dialog-window-content', style['ai-dialog-window-content'])}>{aiDialog.content}</div>
        </ErrorBoundary>
      </div>
    ) : null;

  const aiEntryMobile = deviceIsMobile && aiDialog && aiType === 'closed' ? <MobileAiEntry variant={portalMenu ? 'boundary' : 'viewport'} onOpen={() => setAiType('small')} /> : null;

  // portal 到 boundary（popup 挂载点）时，layout 上的 CSS 变量不会随 portal 继承，需要显式透传
  const aiPortalVars = {
    '--background': background,
    '--toolbar-height': deviceIsMobile && toolbarShow ? (toolbarMinimal ? '48px' : '62px') : '0px',
    '--safe-area-inset-top': 'env(safe-area-inset-top)',
    '--safe-area-inset-bottom': 'env(safe-area-inset-bottom)'
  };

  const aiOverlayContent =
    aiDialogWindow || aiEntryMobile ? (
      <>
        {aiDialogWindow}
        {aiEntryMobile}
      </>
    ) : null;

  const aiOverlay = !aiOverlayContent
    ? null
    : portalMenu
      ? createPortal(
          <div className={classnames('ai-boundary-overlay', style['ai-boundary-overlay'])} style={aiPortalVars}>
            {aiOverlayContent}
          </div>,
          menuPortalTarget
        )
      : aiOverlayContent;

  return (
    // 移动端控件统一 large：高 40px，满足触控尺寸
    <ConfigProvider componentSize={deviceIsMobile ? 'large' : undefined} theme={deviceIsMobile ? MOBILE_THEME : undefined}>
      <LayoutResponsiveScope boundaryRef={layoutIsBoundary ? layoutBoundaryRef : undefined} scrollRef={pageScrollRef} getScrollElement={getPageScrollElement}>
        <Provider value={contextValue}>
          <div ref={topRef} />
          <div
            ref={layoutBoundaryRef}
            className={classnames(className, 'layout', style['layout'], LAYOUT_SCOPE_CLASS, {
              [RESPONSIVE_BOUNDARY_CLASS]: layoutIsBoundary,
              'is-mobile': deviceIsMobile,
              [style['is-mobile']]: deviceIsMobile,
              'has-toolbar': deviceIsMobile && toolbarShow,
              [style['has-toolbar']]: deviceIsMobile && toolbarShow,
              'is-toolbar-minimal': deviceIsMobile && toolbarShow && toolbarMinimal,
              [style['is-toolbar-minimal']]: deviceIsMobile && toolbarShow && toolbarMinimal,
              'has-navbar': deviceIsMobile && navbarShow,
              [style['has-navbar']]: deviceIsMobile && navbarShow
            })}
            style={{
              '--layout-padding': typeof padding === 'number' ? `${padding}px` : padding,
              ...(isZeroPadding ? { '--page-radius': '0px' } : null),
              '--menu-max-width': menuMaxWidth,
              '--menu-min-width': menuMinWidth,
              '--background': background,
              ...(deviceIsMobile && toolbarShow ? { '--toolbar-height': toolbarMinimal ? '48px' : '62px' } : null)
            }}
          >
            {!portalMenu && layerMenuNode}
            <Flex style={{ flex: 1, minHeight: 0, width: '100%', height: 0 }}>
              {!portalMenu && menuNode}
              {portalMenu &&
                createPortal(
                  <div className={classnames(style['menu-boundary-overlay'])} style={menuPortalVars}>
                    {layerMenuNode}
                    {menuNode}
                  </div>,
                  menuPortalTarget
                )}
              <Flex flex={1} ref={pageRef} className={classnames('page', style['page'])}>
                <Row className={classnames('page-content', style['page-content'])}>
                  {!deviceIsMobile && aiDialog && aiType === 'inner' && (
                    <Col span={8} className={classnames('page-dialog-outer', style['page-dialog-outer'])}>
                      <div className={classnames('page-dialog', style['page-dialog'])}>
                        <Flex className={classnames('ai-dialog-window-title', style['ai-dialog-window-title'])}>
                          <div>{aiDialog.title}</div>
                          <Flex gap={10}>
                            <Icon
                              className="btn"
                              type="icon-a-Typeclose"
                              fontClassName="system"
                              onClick={() => {
                                setAiType('closed');
                              }}
                            />
                          </Flex>
                        </Flex>
                        <ErrorBoundary>
                          <div className={classnames('page-window-content', style['page-window-content'])}>{aiDialog.content}</div>
                        </ErrorBoundary>
                      </div>
                    </Col>
                  )}
                  <Col span={!deviceIsMobile && aiDialog && aiType === 'inner' ? 16 : 24} className={RESPONSIVE_CONTAINER_CLASS}>
                    <ErrorBoundary>
                      {openScrollbar ? (
                        <SimpleBar
                          ref={handlePageScrollRef}
                          className={classnames('page-children', style['page-children'], RESPONSIVE_SCROLL_CLASS, {
                            ['has-left']: aiType === 'inner'
                          })}
                        >
                          {children}
                        </SimpleBar>
                      ) : (
                        <div
                          ref={handlePageScrollRef}
                          className={classnames('page-children', style['page-children'], !deviceIsMobile && 'is-scroller', !deviceIsMobile && style['is-scroller'], !deviceIsMobile && RESPONSIVE_SCROLL_CLASS, {
                            ['has-left']: aiType === 'inner'
                          })}
                        >
                          {children}
                        </div>
                      )}
                    </ErrorBoundary>
                  </Col>
                </Row>
              </Flex>
            </Flex>
            {aiOverlay}
            <Toolbar {...menu} className={classnames(style['toolbar'])} show={deviceIsMobile && toolbarShow} target={toolbarTarget} minimal={toolbarMinimal} />
          </div>
        </Provider>
      </LayoutResponsiveScope>
    </ConfigProvider>
  );
};

export default Layout;

/** 包在此 class 容器内可取消 layout 默认的胶囊按钮圆角 */
export const NO_CAPSULE_BTN_CLASS = 'kne-system-layout-no-capsule-btn';
export { LAYOUT_SCOPE_CLASS } from '../layoutScope';
