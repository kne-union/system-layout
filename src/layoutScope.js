/** 通用样式作用域。portal 到 .layout 外时，挂载点也要带上这个 class。 */
export const LAYOUT_SCOPE_CLASS = 'kne-system-layout-scope';

const SCOPE_VARS = [
  '--background',
  '--toolbar-height',
  '--toolbar-bottom-gap',
  '--safe-area-inset-top',
  '--safe-area-inset-bottom',
  '--menu-max-width',
  '--menu-min-width',
  '--primary-color',
  '--primary-color-1',
  '--primary-color-2',
  '--font-color-grey',
  '--font-color-disabled'
];

const previousVars = new WeakMap();

export const syncLayoutScope = (boundary, source) => {
  if (!boundary) {
    return;
  }
  boundary.classList.add(LAYOUT_SCOPE_CLASS);
  if (!source || typeof window === 'undefined') {
    return;
  }
  const previous = previousVars.get(boundary) || {};
  const computed = window.getComputedStyle(source);
  SCOPE_VARS.forEach(name => {
    const value = computed.getPropertyValue(name).trim();
    if (!value) {
      return;
    }
    if (!(name in previous)) {
      previous[name] = boundary.style.getPropertyValue(name);
    }
    boundary.style.setProperty(name, value);
  });
  previousVars.set(boundary, previous);
};

export const clearLayoutScope = boundary => {
  if (!boundary) {
    return;
  }
  boundary.classList.remove(LAYOUT_SCOPE_CLASS);
  const previous = previousVars.get(boundary) || {};
  Object.keys(previous).forEach(name => {
    if (previous[name]) {
      boundary.style.setProperty(name, previous[name]);
    } else {
      boundary.style.removeProperty(name);
    }
  });
  previousVars.delete(boundary);
};
