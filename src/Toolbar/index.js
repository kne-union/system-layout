import { createPortal } from 'react-dom';
import { Flex } from 'antd';
import ensureSlash from '@kne/ensure-slash';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '@kne/react-icon';
import classnames from 'classnames';
import style from './style.module.scss';
import { isValidElement } from 'react';
import isPlainObject from 'lodash/isPlainObject';

const Toolbar = ({ show = true, className, items, activeKey, base = '', onChange, target }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPathname = base ? location.pathname.replace(new RegExp(`^${base}`), '') : location.pathname;
  const toolbarMenu = items.filter(item => item.toolbar);

  if (!show) {
    return null;
  }

  return (
    <div className={classnames('toolbar', style['toolbar'], className)}>
      {createPortal(
        <Flex className={classnames('toolbar-list', style['toolbar-list'])}>
          {toolbarMenu.map((item, index) => {
            const active = (() => {
              if (typeof activeKey === 'string') {
                return activeKey === item.key;
              }
              if (typeof activeKey === 'function') {
                return activeKey(item, { base });
              }
              if (typeof item.path === 'string') {
                return ensureSlash(currentPathname) === ensureSlash(item.path);
              }
              return false;
            })();
            const icon = typeof item.icon === 'function' ? item.icon({ active }) : item.icon;
            return (
              <Flex
                key={item.key || item.path || index}
                vertical
                flex={1}
                justify="center"
                align="center"
                gap={8}
                className={classnames('toolbar-item', style['toolbar-item'], {
                  ['is-active']: active
                })}
                onClick={e => {
                  if (active) {
                    return;
                  }
                  onChange && onChange(item, { base });
                  if (typeof item.onClick === 'function') {
                    item.onClick(item, { menuOpen, base, event: e });
                    return;
                  }
                  if (item.path) {
                    navigate(ensureSlash(`${base}${item.path}`));
                  }
                }}
              >
                {(icon => {
                  if (typeof icon === 'string') {
                    return <Icon className={classnames('toolbar-item-icon', style['toolbar-item-icon'])} type={icon} fontClassName="system" />;
                  }

                  if (isValidElement(icon)) {
                    return <span className={classnames('toolbar-item-icon', style['toolbar-item-icon'])}>{icon}</span>;
                  }

                  if (isPlainObject(icon) && typeof icon.type === 'string') {
                    return <Icon {...icon} className={classnames('toolbar-item-icon', style['toolbar-item-icon'])} />;
                  }

                  return null;
                })(icon)}
                <div className={classnames('toolbar-item-label', style['toolbar-item-label'])}>{item.label}</div>
              </Flex>
            );
          })}
        </Flex>,
        target ? (typeof target === 'function' ? target() : target) : document.body
      )}
    </div>
  );
};

export default Toolbar;
