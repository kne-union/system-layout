import { useMemo, useState, useRef, useEffect } from 'react';
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
import 'simplebar-react/dist/simplebar.min.css';

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
  const deviceIsMobile = typeof isMobileProps === 'boolean' ? isMobileProps : isMobile;
  const [menuOpen, setMenuOpen] = useState(typeof localMenuOpen === 'boolean' ? localMenuOpen : !deviceIsMobile);
  const [toolbarShow, setToolbarShow] = useState(true);
  const [navbarShow, setNavbarShow] = useState(true);
  const [aiType, setAiType] = useState('closed');
  const openScrollbar = typeof openScrollbarProps === 'boolean' ? openScrollbarProps : !deviceIsMobile && !window.__COMPONENTS_CORE_SIMPLE_BAR_DISABLED;
  const userAvatar = userInfo?.avatar;
  const contextValue = useMemo(() => {
    return {
      setToolbarShow,
      setNavbarShow,
      setMenuOpen,
      deviceIsMobile,
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
  }, [deviceIsMobile, logo, userAvatar]);
  const topRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    topRef.current && topRef.current.scrollIntoView();
  }, [location]);
  return (
    <Provider value={contextValue}>
      <div ref={topRef} />
      <div
        className={classnames(className, 'layout', style['layout'], {
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
        {deviceIsMobile && (
          <div
            className={classnames('layer-menu', style['layer-menu'], {
              ['open']: menuOpen,
              [style['open']]: menuOpen
            })}
            onClick={() => {
              setMenuOpen(false);
            }}
          />
        )}
        <Flex>
          <div
            className={classnames('menu', style['menu'], {
              ['open']: menuOpen,
              [style['open']]: menuOpen
            })}
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
                <ErrorBoundary>{menuHeader ? typeof menuHeader === 'function' ? menuHeader({ menuOpen }) : menuHeader : <UserCard menuOpen={menuOpen} {...Object.assign({}, userInfo)} />}</ErrorBoundary>
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
          <Flex flex={1} className={classnames('page', style['page'])}>
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
              <Col span={!deviceIsMobile && aiDialog && aiType === 'inner' ? 16 : 24}>
                <ErrorBoundary>
                  {openScrollbar ? (
                    <SimpleBar
                      className={classnames('page-children', style['page-children'], {
                        ['has-left']: aiType === 'inner'
                      })}
                    >
                      {children}
                    </SimpleBar>
                  ) : (
                    <div
                      className={classnames('page-children', 'is-scroller', style['page-children'], style['is-scroller'], {
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
  );
};

export default Layout;
