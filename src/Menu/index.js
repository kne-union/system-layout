import { Flex } from 'antd';
import { isValidElement } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Icon from '@kne/react-icon';
import ensureSlash from '@kne/ensure-slash';
import isPlainObject from 'lodash/isPlainObject';
import style from './style.module.scss';

const Menu = ({ className, menuOpen, items, activeKey, base = '', onChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = base ? location.pathname.replace(new RegExp(`^${base}`), '') : location.pathname;
  return (
    <div className={classnames('menu', className, style['menu-list'])}>
      {items.map((item, index) => {
        const active = (() => {
          if (typeof activeKey === 'string') {
            return activeKey === item.key;
          }
          if (typeof activeKey === 'function') {
            return activeKey(item, { menuOpen, base });
          }
          if (typeof item.path === 'string') {
            return ensureSlash(currentPathname) === ensureSlash(item.path);
          }
          return false;
        })();

        const icon = typeof item.icon === 'function' ? item.icon({ menuOpen, active }) : item.icon;
        const hasGroup = item.group && item.group !== items[index - 1]?.group;
        return (
          <div
            key={item.key || item.path || index}
            title={item.label}
            onClick={e => {
              onChange && onChange(item, { menuOpen, base });
              if (typeof item.onClick === 'function') {
                item.onClick(item, { menuOpen, base, event: e });
                return;
              }
              if (item.path) {
                navigate(ensureSlash(`${base}${item.path}`));
              }
            }}>
            {hasGroup && menuOpen ? <div className={classnames('menu-group', style['menu-group'])}>{item.groupLabel || item.group}</div> : null}
            {hasGroup && !menuOpen ? <div className={classnames('menu-group-split', style['menu-group-split'])} /> : null}
            <Flex
              className={classnames('menu-item', style['menu-item'], {
                ['is-active']: active,
                ['is-closed']: !menuOpen
              })}
              align="center"
              gap={8}>
              {(icon => {
                if (typeof icon === 'string') {
                  return <Icon className={classnames('menu-item-icon', style['menu-item-icon'])} type={icon} fontClassName="system" />;
                }

                if (isValidElement(icon)) {
                  return <span className={classnames('menu-item-icon', style['menu-item-icon'])}>{icon}</span>;
                }

                if (isPlainObject(icon) && typeof icon.type === 'string') {
                  return <Icon {...icon} className={classnames('menu-item-icon', style['menu-item-icon'])} />;
                }

                return null;
              })(icon)}
              {menuOpen && item.label}
            </Flex>
          </div>
        );
      })}
    </div>
  );
};

export default Menu;
