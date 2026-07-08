import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Flex, Row, Col } from 'antd';
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
import { useLocation } from 'react-router-dom';
import useIsMobile from '../useIsMobile';
import { ResponsiveProvider, useResponsiveContext, defaultResponsiveContextValue, findResponsiveScroll, getDefaultScrollElement, RESPONSIVE_BOUNDARY_CLASS, RESPONSIVE_CONTAINER_CLASS, RESPONSIVE_SCROLL_CLASS } from '@kne/responsive-utils';
import 'simplebar-react/dist/simplebar.min.css';

const hasParentResponsiveProvider = parent => {
  return parent.getBoundaryElement !== defaultResponsiveContextValue.getBoundaryElement || parent.getScrollElement !== defaultResponsiveContextValue.getScrollElement;
};

const resolvePageScrollElement = (pageScrollRef, openScrollbar, deviceIsMobile) => {
  if (deviceIsMobile && !openScrollbar) {
    const anchor = pageScrollRef.current;
    if (anchor && anchor.parentElement) {
      const parentScroll = findResponsiveScroll(anchor.parentElement);
      if (parentScroll) {
        return parentScroll;
      }
    }
    return getDefaultScrollElement();
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

const LayoutResponsiveScope = ({ boundaryRef, scrollRef, getScrollElement, children }) => {
  const parent = useResponsiveContext();
  if (hasParentResponsiveProvider(parent)) {
    return children;
  }
  return (
    <ResponsiveProvider boundaryRef={boundaryRef} scrollRef={scrollRef} getScrollElement={getScrollElement}>
      {children}
    </ResponsiveProvider>
  );
};

const LayoutMenuOpenKey = 'LAYOUT_MENU_OPEN';

const Layout = ({
  className,
  menu,
  background = 'linear-gradient(0deg, #BBCFE7 0%, #BBCFE7 100%), #FFFFFF',
  menuMaxWidth = '254px',
  menuMinWidth = '84px',
  logo,
  menuHeader,
  userInfo,
  aiDialog = null,
  openScrollbar: openScrollbarProps,
  isMobile: isMobileProps,
  toolbarTarget,
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
  const openScrollbar = typeof openScrollbarProps === 'boolean' ? openScrollbarProps : !deviceIsMobile && !window.__COMPONENTS_CORE_SIMPLE_BAR_DISABLED;
  const userAvatar = userInfo?.avatar;
  const contextValue = useMemo(() => {
    return {
      setToolbarShow,
      setNavbarShow,
      setMenuOpen,
      deviceIsMobile,
      scrollReady,
      logo: Object.assign(
        {},
        logo
          ? logo
          : {
              src: defaultLogo
            }
      ),
      userAvatar
    };
  }, [deviceIsMobile, logo, userAvatar, scrollReady]);
  const topRef = useRef(null);
  const pageRef = useRef(null);
  const layoutBoundaryRef = useRef(null);
  const pageScrollRef = useRef(null);
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

  useEffect(() => {
    const scrollEl = getPageScrollElement();
    if (scrollEl && typeof scrollEl.scrollTo === 'function') {
      scrollEl.scrollTo(0, 0);
      return;
    }
    topRef.current?.scrollIntoView();
  }, [location, getPageScrollElement]);

  const userCard = <UserCard menuOpen={menuOpen} {...Object.assign({}, userInfo)} />;

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
      <div className={classnames('logo', style['logo'])}>
        <Image className={style['logo-img']} {...contextValue.logo} />
      </div>
      <div
        className={classnames('expand-btn-wrapper', style['expand-btn-wrapper'])}
        onClick={() => {
          setMenuOpen(menuOpen => {
            localStorage.setItem(LayoutMenuOpenKey, !menuOpen);
            return !menuOpen;
          });
        }}
      >
        <ExpandIcon
          className={classnames('expand-btn', style['expand-btn'], {
            'is-closed': !menuOpen
          })}
        />
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
        {aiDialog && (
          <div
            className={classnames('ai-entry', style['ai-entry'])}
            onClick={() => {
              setAiType('small');
            }}
          >
            <Icon type="system-prompt" colorful />
          </div>
        )}
      </div>
    </div>
  );

  const portalMenu = useMenuPortal && menuPortalTarget;

  return (
    <LayoutResponsiveScope boundaryRef={layoutBoundaryRef} scrollRef={pageScrollRef} getScrollElement={getPageScrollElement}>
      <Provider value={contextValue}>
        <div ref={topRef} />
        <div
          ref={layoutBoundaryRef}
          className={classnames(className, 'layout', style['layout'], RESPONSIVE_BOUNDARY_CLASS, {
            'is-mobile': deviceIsMobile,
            [style['is-mobile']]: deviceIsMobile,
            'has-toolbar': deviceIsMobile && toolbarShow,
            [style['has-toolbar']]: deviceIsMobile && toolbarShow,
            'has-navbar': deviceIsMobile && navbarShow,
            [style['has-navbar']]: deviceIsMobile && navbarShow
          })}
          style={{
            '--menu-max-width': menuMaxWidth,
            '--menu-min-width': menuMinWidth,
            '--background': background
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
            {aiDialog && aiType === 'small' && (
              <div className={classnames('ai-dialog-window', style['ai-dialog-window'])}>
                <Flex className={classnames('ai-dialog-window-title', style['ai-dialog-window-title'])}>
                  <div>{aiDialog.title}</div>
                  <Flex gap={10}>
                    <Icon
                      className="btn"
                      type="icon-a-Typeopen_in_full"
                      fontClassName="system"
                      onClick={() => {
                        setAiType('inner');
                      }}
                    />
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
                  <div className={classnames('ai-dialog-window-content', style['ai-dialog-window-content'])}>{aiDialog.content}</div>
                </ErrorBoundary>
              </div>
            )}
          </Flex>
          <Toolbar {...menu} className={classnames(style['toolbar'])} show={deviceIsMobile && toolbarShow} target={toolbarTarget} />
        </div>
      </Provider>
    </LayoutResponsiveScope>
  );
};

export default Layout;
