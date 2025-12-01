import { Flex } from 'antd';
import ButtonGroup from '@kne/button-group';
import classnames from 'classnames';
import style from './style.module.scss';

const Page = ({ title, extra = null, buttonProps, children }) => {
  return (<Flex vertical gap={24}>
    <Flex justify="space-between" gap={20}>
      <div className={classnames('page-title', style['page-title'])}>{title}</div>
      <div className={classnames('page-title-extra', style['page-title-extra'])}>{buttonProps ?
        <ButtonGroup {...buttonProps} /> : extra}</div>
    </Flex>
    <div>{children}</div>
  </Flex>);
};

export default Page;
