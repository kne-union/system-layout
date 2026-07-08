import { Flex } from 'antd';
import { isValidElement, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import Icon from '@kne/react-icon';
import ensureSlash from '@kne/ensure-slash';
import isPlainObject from 'lodash/isPlainObject';
import VirtualList from 'rc-virtual-list';
import style from './style.module.scss';

const MENU_ITEM_HEIGHT = 52;
const MENU_GROUP_HEIGHT = 48;
const MENU_GROUP_SPLIT_HEIGHT = 17;

const getItemKey = (item, index) => item.key || item.path || index;

const Menu = ({ className, menuOpen, items, activeKey, base = '', onChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const listRef = useRef(null);
  const virtualListRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const currentPathname = base ? location.pathname.replace(new RegExp(`^${base}`), '') : location.pathname;

  const isItemActive = useCallback(
    item => {
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
    },
    [activeKey, base, currentPathname, menuOpen]
  );

  const getEstimatedItemHeight = useCallback(
    (item, index) => {
      const hasGroup = item.group && item.group !== items[index - 1]?.group;
      if (!hasGroup) {
        return MENU_ITEM_HEIGHT;
      }
      return MENU_ITEM_HEIGHT + (menuOpen ? MENU_GROUP_HEIGHT : MENU_GROUP_SPLIT_HEIGHT);
    },
    [items, menuOpen]
  );

  const estimatedItemHeight = useMemo(() => {
    if (!items.length) {
      return MENU_ITEM_HEIGHT;
    }
    const total = items.reduce((sum, item, index) => sum + getEstimatedItemHeight(item, index), 0);
    return Math.max(MENU_ITEM_HEIGHT, Math.ceil(total / items.length));
  }, [getEstimatedItemHeight, items]);

  const listData = useMemo(
    () =>
      items.map((item, index) => ({
        item,
        index,
        key: getItemKey(item, index)
      })),
    [items]
  );

  const activeIndex = useMemo(() => listData.findIndex(({ item }) => isItemActive(item)), [isItemActive, listData]);

  useLayoutEffect(() => {
    const el = listRef.current;
    if (!el) {
      return;
    }
    const updateHeight = () => {
      const styles = getComputedStyle(el);
      const paddingY = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
      setListHeight(el.clientHeight - paddingY);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (activeIndex < 0 || listHeight <= 0) {
      return;
    }
    virtualListRef.current?.scrollTo({
      index: activeIndex,
      align: 'auto'
    });
  }, [activeIndex, listHeight, menuOpen, listData.length]);

  const renderMenuItem = (item, index) => {
    const active = isItemActive(item);
    const icon = typeof item.icon === 'function' ? item.icon({ menuOpen, active }) : item.icon;
    const hasGroup = item.group && item.group !== items[index - 1]?.group;

    return (
      <div
        key={getItemKey(item, index)}
        title={item.label}
        onClick={e => {
          if (active) {
            return;
          }
          onChange && onChange(item, { menuOpen, base });
          if (typeof item.onClick === 'function') {
            item.onClick(item, { menuOpen, base, event: e });
            return;
          }
          if (item.path) {
            navigate(ensureSlash(`${base}${item.path}`));
          }
        }}
      >
        {hasGroup && menuOpen ? <div className={classnames('menu-group', style['menu-group'])}>{item.groupLabel || item.group}</div> : null}
        {hasGroup && !menuOpen ? <div className={classnames('menu-group-split', style['menu-group-split'])} /> : null}
        <Flex
          className={classnames('menu-item', style['menu-item'], {
            ['is-active']: active,
            ['is-closed']: !menuOpen
          })}
          align="center"
          gap={8}
        >
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
  };

  return (
    <div ref={listRef} className={classnames('menu', className, style['menu-list'])}>
      {listHeight > 0 ? (
        <VirtualList ref={virtualListRef} data={listData} height={listHeight} itemHeight={estimatedItemHeight} itemKey="key" virtual={listData.length > 0}>
          {({ item, index }) => renderMenuItem(item, index)}
        </VirtualList>
      ) : null}
    </div>
  );
};

export default Menu;
