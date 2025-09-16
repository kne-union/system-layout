import { Image } from '@kne/react-file';
import { Flex } from 'antd';
import classnames from 'classnames';
import style from './style.module.scss';

const UserCard = ({ name, avatar, email, phone, menuOpen }) => {
  if (!menuOpen) {
    return <Image.Avatar id={avatar} src={avatar} shape="circle" size={40} alt="avatar" />;
  }
  return (
    <Flex gap={12} justify="center">
      <Image.Avatar id={avatar} src={avatar} shape="circle" size={40} alt="avatar" />
      <Flex vertical>
        <div className={classnames('username', style['username'])}>{name || '-'}</div>
        <div className={classnames('user-description', style['user-description'])}>{email || phone || '-'}</div>
      </Flex>
    </Flex>
  );
};

export default UserCard;
