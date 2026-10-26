import { Image } from '@kne/react-file';
import { Flex, Tooltip } from 'antd';
import classnames from 'classnames';
import style from './style.module.scss';

const UserCard = ({ name, avatar, email, phone, description, menuOpen, extra }) => {
  if (!menuOpen) {
    // 收起态仅剩头像，用 Tooltip 补充身份信息，避免鼠标用户无从得知当前用户
    return (
      <Tooltip title={name || '-'} mouseEnterDelay={0.3}>
        <Image.Avatar id={avatar} src={avatar} shape="circle" size={40} alt="avatar" />
      </Tooltip>
    );
  }
  return (
    <Flex gap={12} justify="center">
      <Image.Avatar id={avatar} src={avatar} shape="circle" size={40} alt="avatar" />
      <Flex vertical>
        <div className={classnames('username', style['username'])}>{name || '-'}</div>
        <div className={classnames('user-description', style['user-description'])}>{email || phone || description || '-'}</div>
        {extra}
      </Flex>
    </Flex>
  );
};

export default UserCard;
