import { Flex, Button, Skeleton } from 'antd';
import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import Icon from '@kne/react-icon';
import ButtonGroup from '@kne/button-group';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useScrollElement, usePopupContainer, useResponsiveContext } from '@kne/responsive-utils';
import { useContext } from '../context';
import style from './style.module.scss';
import { Image } from '@kne/react-file';

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
    let boundEl = null;
    let remove = null;

    const bind = () => {
      const scrollEl = getScrollElement();
      if (!scrollEl || typeof scrollEl.addEventListener !== 'function' || scrollEl === boundEl) {
        return;
      }
      if (typeof remove === 'function') {
        remove();
      }
      boundEl = scrollEl;
      const handleScroll = () => {
        const threshold = navbarRef.current ? navbarRef.current.offsetHeight : 48;
        setIsScrolled(scrollEl.scrollTop > threshold);
      };
      handleScroll();
      scrollEl.addEventListener('scroll', handleScroll, { passive: true });
      remove = () => scrollEl.removeEventListener('scroll', handleScroll);
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

  const titleExtraContent = (() => {
    if (extra) {
      if (deviceIsMobile && userAvatar) {
        return (
          <Flex gap={4} align="center">
            {extra}
            <Image.Avatar id={userAvatar} src={userAvatar} shape="circle" size={30} alt="avatar" />
          </Flex>
        );
      }
      return extra;
    }
    if (deviceIsMobile && (buttonProps || userAvatar)) {
      const actions = buttonProps ? (
        <div className={classnames('page-title-actions', style['page-title-actions'])}>
          <ButtonGroup {...Object.assign({}, buttonProps, { showLength: 0, moreType: 'link' })} />
        </div>
      ) : null;
      const avatar = userAvatar ? <Image.Avatar id={userAvatar} src={userAvatar} shape="circle" size={30} alt="avatar" /> : null;
      // 仅更多按钮时不要套带 gap 的 Flex，否则 ButtonGroup 测宽空节点也会吃 gap，导致不居中
      if (actions && avatar) {
        return (
          <Flex gap={4} align="center">
            {actions}
            {avatar}
          </Flex>
        );
      }
      return actions || avatar;
    }
    if (buttonProps) {
      return <ButtonGroup {...buttonProps} />;
    }
    return null;
  })();

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
      {titleExtraContent ? <div className={classnames('page-title-extra', style['page-title-extra'], style['has-float'])}>{titleExtraContent}</div> : null}
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

export default Page;
