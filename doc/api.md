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
| `logo` | `object` \| `null` \| `false` | 默认 Logo | Logo 配置，props 传递给 `@kne/react-file` 的 Image 组件。不传时显示默认 Logo；传 `null`、`false` 或不含 `src` / `id` 的对象时不显示 Logo，只保留展开收起按钮。图片加载中和加载失败的占位图都限制在 24px 高 |
| `menuHeader` | `ReactNode` \| `function` | 默认 UserCard | 菜单头部内容，函数形式接收 `{ menuOpen, userCard }` 参数 |
| `userInfo` | `object` | - | 用户信息，详见 userInfo 配置 |
| `aiDialog` | `object` | `null` | AI 对话框配置，包含 `title` 和 `content` 字段 |
| `openScrollbar` | `boolean` | - | 是否开启自定义滚动条（SimpleBar），默认桌面端开启、移动端关闭 |
| `isMobile` | `boolean` | - | 是否强制移动端模式，不设置时自动检测 |
| `toolbarTarget` | `HTMLElement` | `document.body` | 移动端工具栏 Portal 的目标容器 |
| `toolbarMinimal` | `boolean` | `false` | 移动端底部工具栏是否使用极简模式。`false` 为普通模式（展示标题与选中背景），`true` 为极简模式（仅图标） |
| `children` | `ReactNode` | - | 页面内容，通常为 Page 组件 |

#### 移动端规范

移动端按触控与可读性要求统一尺寸。是否为移动端统一以 Layout 的移动端状态为准（`isMobile` 属性，或视口 / 预览边界宽度 ≤ 768px），不按内容区宽度判断：桌面端即使侧边菜单让内容区窄于 768px，也保持桌面尺寸。

- 正文字号 15px（antd token `fontSize: 15`），标签、辅助说明等次要文字保持 13–14px
- antd 控件默认 `componentSize="large"`（高 40px），`components-core:FormInfo` 字段同样放大到 40px
- 所有输入框（含 TablePage 搜索框等固定尺寸控件）字号不低于 16px，iOS 聚焦输入框时不会缩放页面
- 页面左右与内容区边距 16px，导航标题 17px 加粗，导航栏圆钮 40px
- FormInfo / InfoPage 的分组（`.ant-card.part`）渲染为玻璃卡片，移动端内边距 16px
- 底部 Toolbar 高 62px、左右边距 20px；与 Page.Footer 合并时，底栏态（左侧圆钮 + 底栏）整行 48px，展开导航态右侧圆钮与 Toolbar 同为 62px，圆钮与底栏间距 12px

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

> AI 对话框在桌面端支持三种状态：`closed`（关闭）、`small`（小窗口）、`inner`（内嵌面板），通过菜单底部入口按钮打开；`small` 与 `inner` 之间可通过窗口右上角图标切换。
>
> 移动端入口为悬浮在右下角（工具栏上方）的可拖动按钮，点击后以全屏形式展示对话框，仅提供关闭按钮，不支持内嵌面板模式。

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
| `badge` | `number` \| `boolean` \| `object` | - | 徽标。数字为数量，`true` 为圆点，对象透传给 antd `Badge`（如 `{ count, dot, overflowCount, showZero }`）。展开菜单时显示在文字右侧，收起菜单和 Toolbar 显示在图标角上 |
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
| `moreType` | `string` | "更多"按钮的类型 |

#### 移动端导航栏右侧

移动端右侧由独立的玻璃圆钮组成，常态与滚动后的胶囊态形态一致：

- `buttonProps`：全部按钮收进"更多"圆钮，点击后向右下展开菜单，`showLength`、`more`、`placement` 由 Page 接管
- `extra`：放在玻璃胶囊内，渲染结果为空时自动隐藏
- 用户头像：始终显示头像圆钮（未配置 `userInfo.avatar` 时为默认头像），点击打开左侧菜单

#### 移动端菜单入口

- 一级页面（不传 `back`）：左上角为菜单按钮，右侧头像圆钮同样可打开菜单
- 二级页面（传 `back`）：左上角只放返回按钮，通过右侧头像圆钮打开菜单；`back` 只用于从上级页面进入的页面

#### Page.PageLoading

加载状态子组件，展示 Skeleton 骨架屏。

#### Page.Footer

贴在 Page 内容列底部的操作栏。宽度等于内容列，不吃 `.page-children` / `.page-inner` 的内边距。用它包住按钮或其他操作内容；同一页只放一个。

```jsx
<Page title="工单">
  <div>表单内容</div>
  <Page.Footer>
    <Button>取消</Button>
    <Button type="primary">提交</Button>
  </Page.Footer>
</Page>
```

| 属性 | 类型 | 说明 |
|------|------|------|
| `children` | `ReactNode` | 底栏内容，右对齐 |
| `className` | `string` | 追加到根节点，可覆盖默认样式 |
| `icon` | `string` \| `ReactNode` | 移动端与 Toolbar 合并时，底栏收起成圆钮所显示的图标；字符串按 system 图标字体渲染。默认为 `FooterOpenIcon`（左右切换箭头，表示切回底部操作栏），可从本库引入复用 |

底栏会 portal 到内容列底部，并写入 `--page-footer-height`，让滚动内容停在底栏上方。

移动端：

- `toolbar={false}` 时底栏贴住页面底边，并在底栏内留出安全区。
- 当前页显示 Toolbar 时，底栏与 Toolbar 合并为同一行：默认展示底栏，Toolbar 收成左侧圆钮（显示当前导航项图标）；点圆钮展开 Toolbar，底栏收成右侧圆钮，点它切回底栏。展开 Toolbar 后滚动页面也会自动切回底栏。展示底栏时向下滚动，左侧圆钮缩向左下角，底栏收成右侧圆钮并缩向右下角，与普通 Toolbar 的滚动收缩一致，停止滚动后放开。
- 手机预览框内会挂到预览边界，而不是浏览器视口。

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
| `toolbarShow` | `boolean` | 移动端底部工具栏当前是否显示 |
| `toolbarMinimal` | `boolean` | 移动端工具栏是否为收起后的窄高度 |
| `logo` | `object` \| `null` | Logo 配置对象，不显示 Logo 时为 `null` |
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

### Card / CARD_THEME

页面卡片使用 `@kne/react-box` 的 `Card`，本库在其上注册了一组贴合 SystemLayout 风格的主题。业务直接从本库引入 `Card`，通过 `theme` 选择主题，不要再自己写卡片背景、边框、阴影。

```jsx
import { Card, CARD_THEME } from '@kne/system-layout';

<Card theme={CARD_THEME.glass} title="入职清单" extra="2/4">...</Card>
<Card theme={CARD_THEME.accent} color="#52c41a">...</Card>
```

| 主题 | 值 | 适用场景 |
|------|------|------|
| `CARD_THEME.glass` | `'system-glass'` | 默认内容卡：通透的 liquid glass，融入页面背景 |
| `CARD_THEME.solid` | `'system-solid'` | 列表项 / 移动端卡片 / 浮层面板：更致密的 liquid glass，信息密集时保证可读 |
| `CARD_THEME.tint` | `'system-tint'` | 欢迎区、提示区等需要强调的区块：主色染色的 liquid glass，标题为主色 |
| `CARD_THEME.accent` | `'system-accent'` | 数据概览 / 统计卡：liquid glass + 顶部主色色带 |

所有主题都按 liquid glass 绘制：半透明渐变底、左上斜向高光、白色高光描边与内侧顶部亮边，并对背景做 `blur(20px) saturate(180%)`，与 Toolbar、胶囊导航栏的玻璃质感一致。

主色默认取 `--sl-primary`，跟随宿主主题；传 `color` 时按传入色重算色板（如统计卡按指标色区分）。其余属性（`title`、`subtitle`、`extra`、`description`、`footer`、`prefix`、`padding`、`radius`、`hover`、`colors` 等）与 `@kne/react-box` 的 `Card` 一致。

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
| `NO_CAPSULE_BTN_CLASS` | 包一层可取消 Layout 内按钮默认胶囊圆角 |
| `LAYOUT_SCOPE_CLASS` | 通用样式作用域。内容 portal 到 `.layout` 外时，挂载点带上此类后按钮胶囊、工具类与主题变量仍然生效 |
