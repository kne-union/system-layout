import { Flex, Button } from 'antd';
import { useEffect } from 'react';
import Icon from '@kne/react-icon';
import ButtonGroup from '@kne/button-group';
import classnames from 'classnames';
import { useContext } from '../context';
import style from './style.module.scss';
import { Image } from '@kne/react-file';

const Page = ({ title, extra = null, back, buttonProps, children, toolbar }) => {
  const { setToolbarShow, setMenuOpen, deviceIsMobile, userAvatar } = useContext();
  useEffect(() => {
    setToolbarShow && setToolbarShow(!!toolbar);
  }, [toolbar]);
  return (
    <Flex
      vertical
      gap={24}
      className={classnames('page', style['page'], {
        ['is-mobile']: deviceIsMobile,
        [style['is-mobile']]: deviceIsMobile
      })}
    >
      <Flex justify="space-between" align="center" gap={20} className={classnames('page-header', style['page-header'])}>
        <Flex className={classnames('page-title-outer', style['page-title-outer'])} align="center" gap={4}>
          {back && <Button type="text" icon={<Icon className={style['back-icon']} type="a-Typearrow_forward_ios" fontClassName="system" />} />}
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
          {buttonProps ? (
            deviceIsMobile ? (
              <Flex gap={4} align="center">
                <ButtonGroup {...Object.assign({}, buttonProps, deviceIsMobile ? { showLength: 0, moreType: 'link' } : {})} />
                <Image.Avatar id={userAvatar} src={userAvatar} shape="circle" size={30} alt="avatar" />
              </Flex>
            ) : (
              <ButtonGroup {...buttonProps} />
            )
          ) : (
            extra
          )}
        </div>
      </Flex>
      <div className={classnames('page-inner', style['page-inner'])}>{children}</div>
    </Flex>
  );
};

export default Page;
