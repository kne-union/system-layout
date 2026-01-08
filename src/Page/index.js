import { Flex, Button, Skeleton } from 'antd';
import { useEffect } from 'react';
import Icon from '@kne/react-icon';
import ButtonGroup from '@kne/button-group';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
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
  const { setToolbarShow, setNavbarShow, setMenuOpen, deviceIsMobile, userAvatar } = useContext();
  const navigate = useNavigate();
  useEffect(() => {
    setToolbarShow && setToolbarShow(!!toolbar);
    setNavbarShow && setNavbarShow(!!navbar);
  }, [toolbar, navbar]);

  const navbarEl = navbar ? (
    <Flex justify="space-between" align="center" gap={20} className={classnames('page-header', style['page-header'])}>
      <Flex className={classnames('page-title-outer', style['page-title-outer'])} align="center" gap={4}>
        {back && (
          <Button
            type="text"
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
      <div className={classnames('page-title-extra', style['page-title-extra'])}>
        {extra ? (
          extra
        ) : deviceIsMobile ? (
          <Flex gap={4} align="center">
            {buttonProps && <ButtonGroup {...Object.assign({}, buttonProps, deviceIsMobile ? { showLength: 0, moreType: 'link' } : {})} />}
            <Image.Avatar id={userAvatar} src={userAvatar} shape="circle" size={30} alt="avatar" />
          </Flex>
        ) : (
          buttonProps && <ButtonGroup {...buttonProps} />
        )}
      </div>
    </Flex>
  ) : null;
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
