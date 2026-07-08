### SystemLayout

系统初始化布局组件，提供页面整体结构，包含侧边菜单、用户信息、页面内容区和移动端工具栏。支持桌面端和移动端两种模式。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | - | 自定义类名 |
| `menu` | `object` | - | 菜单配置对象，详见 Menu 配置 |
| `background` | `string` | `linear-gradient(0deg, #BBCFE7 0%, #BBCFE7 100%), #FFFFFF` | 布局背景样式 |
| `menuMaxWidth` | `string` | `254px` | 菜单展开时的最大宽度（桌面端） |
| `menuMinWidth` | `string` | `84px` | 菜单收起时的最小宽度（桌面端） |
| `logo` | `object` | 默认 Logo | Logo 配置，props 传递给 `@kne/react-file` 的 Image 组件 |
| `menuHeader` | `ReactNode` \| `function` | 默认 UserCard | 菜单头部内容，函数形式接收 `{ menuOpen, userCard }` 参数 |
| `userInfo` | `object` | - | 用户信息，详见 userInfo 配置 |
| `aiDialog` | `object` | `null` | AI 对话框配置，包含 `title` 和 `content` 字段（仅桌面端） |
| `openScrollbar` | `boolean` | - | 是否开启自定义滚动条（SimpleBar），默认桌面端开启、移动端关闭 |
| `isMobile` | `boolean` | - | 是否强制移动端模式，不设置时自动检测 |
| `toolbarTarget` | `HTMLElement` | `document.body` | 移动端工具栏 Portal 的目标容器 |
| `children` | `ReactNode` | - | 页面内容，通常为 Page 组件 |

#### userInfo 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `name` | `string` | 用户名 |
| `email` | `string` | 邮箱 |
| `avatar` | `string` | 头像 URL |
| `phone` | `string` | 手机号 |
| `description` | `string` | 描述信息 |
| `extra` | `ReactNode` | 额外展示内容 |

#### aiDialog 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `title` | `string` | 对话框标题 |
| `content` | `ReactNode` | 对话框内容 |

> AI 对话框支持三种状态：`closed`（关闭）、`small`（小窗口）、`inner`（内嵌面板）。仅桌面端可通过菜单底部入口按钮打开。

---

### Menu 配置

Menu 组件由 SystemLayout 的 `menu` 属性配置，不需要单独使用。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `base` | `string` | `''` | 菜单基础路径，用于路由匹配时去除路径前缀 |
| `items` | `array` | - | 菜单项数组，详见 menu items 配置 |
| `activeKey` | `string` \| `function` | - | 当前激活项的 key，函数形式为 `(item, { menuOpen, base }) => boolean` |
| `onChange` | `function` | - | 菜单项点击回调 `(item, { menuOpen, base }) => void` |

#### menu items 配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `key` | `string` | `path` 或 `index` | 唯一标识 |
| `path` | `string` | - | 路由路径，点击后导航至 `base + path` |
| `label` | `string` | - | 显示文本 |
| `icon` | `string` \| `function` \| `ReactElement` \| `object` | - | 图标配置，详见 icon 配置 |
| `group` | `string` | - | 分组名称，相同 group 的项会归为一组 |
| `groupLabel` | `string` | - | 分组显示文本，默认使用 `group` |
| `toolbar` | `boolean` | `false` | 是否在移动端底部工具栏中显示 |
| `onClick` | `function` | - | 自定义点击回调 `(item, { menuOpen, base, event }) => void`，设置后不会自动导航 |

#### icon 配置

icon 支持多种格式：

- **string**：图标类型名，如 `'icon-assignment_ind'`，使用 `@kne/react-icon` 渲染
- **function**：`({ active, menuOpen }) => string`，根据激活状态和菜单展开状态返回图标名
- **ReactElement**：自定义图标元素
- **object**：`{ type: string, ... }`，props 传递给 Icon 组件

---

### Page

页面内容区组件，作为 SystemLayout 的子组件使用，提供标题栏、操作按钮、返回按钮等功能。

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `ReactNode` | - | 页面标题 |
| `extra` | `ReactNode` | `null` | 标题栏右侧自定义内容，设置后替代 `buttonProps` |
| `back` | `boolean` | - | 是否显示返回按钮，点击调用 `navigate(-1)` |
| `buttonProps` | `object` | - | 操作按钮组配置，传递给 `@kne/button-group` 的 ButtonGroup 组件 |
| `toolbar` | `boolean` | `true` | 是否显示移动端底部工具栏 |
| `navbar` | `boolean` | `true` | 是否显示顶部导航栏 |
| `noPadding` | `boolean` | - | 是否移除内容区内边距 |
| `children` | `ReactNode` \| `function` | - | 页面内容 |

#### children 为函数时

当 `children` 为函数时，Page 将渲染控制权交给子组件，函数接收以下参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `navbar` | `ReactElement` | 导航栏元素 |
| `className` | `string` | 内容区类名（包含 noPadding 等修饰类） |
| `render` | `function` | 标准渲染函数，`({ children, className }) => ReactElement`，用于包裹自定义内容以保持标准页面结构 |
| `pageLoading` | `ReactElement` | 加载状态元素（含骨架屏），可直接返回以显示加载状态 |

#### buttonProps 配置

| 属性 | 类型 | 说明 |
|------|------|------|
| `showLength` | `number` | 直接显示的按钮数量，其余收起到"更多"按钮中 |
| `list` | `array` | 按钮配置数组，每项为 antd Button 的 props |
| `moreType` | `string` | "更多"按钮的类型，移动端默认为 `'link'` |

#### Page.PageLoading

加载状态子组件，展示 Skeleton 骨架屏。

---

### useLayoutContext

获取 Layout 上下文的 Hook，在 SystemLayout 内部的子组件中使用。

```js
import { useLayoutContext } from '@kne/system-layout';
const { setToolbarShow, setNavbarShow, setMenuOpen, deviceIsMobile, logo, userAvatar } = useLayoutContext();
```

#### 返回值

| 属性 | 类型 | 说明 |
|------|------|------|
| `setToolbarShow` | `(show: boolean) => void` | 控制移动端底部工具栏显示/隐藏 |
| `setNavbarShow` | `(show: boolean) => void` | 控制移动端顶部导航栏显示/隐藏 |
| `setMenuOpen` | `(open: boolean \| function) => void` | 控制菜单展开/收起 |
| `deviceIsMobile` | `boolean` | 当前是否为移动端模式 |
| `logo` | `object` | Logo 配置对象 |
| `userAvatar` | `string` | 用户头像 URL |

---

### isMobile

同步检测当前设备是否为移动端，基于 `window.matchMedia` 和移动端断点（768px）判断。

```js
import { isMobile } from '@kne/system-layout';
const mobile = isMobile(); // boolean
```

### useIsMobile

响应式移动端检测 Hook，窗口尺寸变化时自动更新。

```js
import { useIsMobile } from '@kne/system-layout';
const mobile = useIsMobile(); // boolean
```

### MOBILE_BREAKPOINT

移动端断点常量（`768px`），可与 `@kne/responsive-utils` 配合使用。

```js
import { MOBILE_BREAKPOINT } from '@kne/system-layout';
```

---

### themeToken

Ant Design 主题 Token 配置对象，将 `Input`、`InputNumber`、`Card`、`Tree`、`Select`、`DatePicker` 组件的背景色设为透明，适配 SystemLayout 的半透明背景风格。

```js
import { themeToken } from '@kne/system-layout';
// 在 ConfigProvider 中使用
<ConfigProvider theme={themeToken}>
  <SystemLayout>...</SystemLayout>
</ConfigProvider>
```

---

### 响应式工具

从 `@kne/responsive-utils` 透传的响应式工具，可通过 SystemLayout 直接引入：

| 导出名 | 说明 |
|--------|------|
| `ResponsiveProvider` | 响应式 Provider 组件 |
| `useBreakpoint` | 断点检测 Hook |
| `useMediaQuery` | 媒体查询 Hook |
| `usePopupContainer` | 弹层容器 Hook |
| `useScrollElement` | 滚动元素 Hook |
| `useResponsiveContext` | 响应式 Context Hook |
| `mobileBreakpoint` | 移动端断点常量（同 `MOBILE_BREAKPOINT`） |
| `RESPONSIVE_CONTAINER_CLASS` | 响应式容器 CSS 类名 |
| `RESPONSIVE_BOUNDARY_CLASS` | 响应式边界 CSS 类名 |
| `RESPONSIVE_SCROLL_CLASS` | 响应式滚动 CSS 类名 |
