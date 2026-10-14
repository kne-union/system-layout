import { Badge } from 'antd';

export const resolveBadgeProps = badge => {
  if (badge == null || badge === false || badge === 0 || badge === '') {
    return null;
  }
  if (badge === true) {
    return { dot: true };
  }
  if (typeof badge === 'number') {
    return { count: badge };
  }
  if (typeof badge === 'object') {
    const { count, dot, showZero } = badge;
    if (!dot && (count == null || count === false || count === 0) && showZero !== true) {
      return null;
    }
    return badge;
  }
  return null;
};

const ItemBadge = ({ badge, className, children }) => {
  const props = resolveBadgeProps(badge);
  if (!props) {
    return children || null;
  }
  return (
    <Badge className={className} size="small" {...props}>
      {children}
    </Badge>
  );
};

export default ItemBadge;
