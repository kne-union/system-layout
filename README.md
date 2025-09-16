
# system-layout


### 描述

用于一个系统初始化布局


### 安装

```shell
npm i --save @kne/system-layout
```


### 概述

用于一个系统初始化布局，提供基础的页面结构和功能模块。

#### 功能模块

- **布局组件**：提供灵活的页面布局，支持菜单展开/折叠。
- **用户信息展示**：支持用户卡片展示。
- **菜单管理**：支持动态菜单配置和路由跳转。


#### 注意

* 请不要忘记引用包的样式

```js
import SystemLayout from '@kne/system-layout';
import '@kne/system-layout/dist/index.css';
```

#### TODO

- [x] 完成基础布局
- [ ] 适配到移动端

### 示例(全屏)

#### 示例代码

- 这里填写示例标题
- 这里填写示例说明
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css)

```jsx
const { default: SystemLayout } = _SystemLayout;

const BaseExample = () => {
  return (
    <div>
      <SystemLayout
        userInfo={{
          name: 'Lucy L',
          email: 'lucy@company.com'
        }}
        aiDialog={{}}
        menu={{
          base: 'SystemLayout',
          items: [
            {
              path: '/',
              label: 'Onboarding',
              icon: ({ active }) => (active ? 'home' : 'home_line')
            },
            {
              group: 'HIRING',
              path: '/hiring',
              label: 'Hiring Hub',
              icon: 'icon-assignment_ind'
            },
            {
              group: 'HIRING',
              path: '/hiring/application',
              label: 'Application List',
              icon: 'icon-assignment'
            },
            {
              group: 'PEOPLE',
              path: '/people',
              label: 'Management',
              icon: 'icon-automation'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review',
              label: 'Projects',
              icon: 'icon-manage_accounts'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review/employee',
              label: 'Employee',
              icon: 'icon-groups_2'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review/ai-models',
              label: 'AI Models',
              icon: 'icon-network_intelligence'
            }
          ]
        }}
      />
    </div>
  );
};

render(<BaseExample />);

```

- 这里填写示例标题
- 这里填写示例说明
- _fontList(./src/icons/fonts),(./src/icons/index),_modulesDev(@kne/modules-dev/dist/create-entry)

```jsx
const { default: fonts } = _fontList;
const { FontList } = _modulesDev;

const BaseExample = () => {
  return <FontList fonts={fonts} />;
};

render(<BaseExample />);

```


### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | - | 自定义类名 |
| `menu` | `object` | - | 菜单配置 |
| `background` | `string` | `linear-gradient(0deg, #BBCFE7 0%, #BBCFE7 100%), #FFFFFF` | 背景样式 |
| `menuMaxWidth` | `string` | `254px` | 菜单最大宽度 |
| `menuMinWidth` | `string` | `84px` | 菜单最小宽度 |
| `logo` | `object` | - | Logo 配置 |
| `menuHeader` | `ReactNode` | - | 菜单头部内容 |
| `userInfo` | `object` | - | 用户信息 |
| `aiDialog` | `object` | `null` | AI 对话框配置 |
| `children` | `ReactNode` | - | 子组件 |

#### Menu 组件

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | - | 自定义类名 |
| `menuOpen` | `boolean` | - | 菜单是否展开 |
| `items` | `array` | - | 菜单项配置 |
| `activeKey` | `string` 或 `function` | - | 当前激活的菜单项 |
| `base` | `string` | `''` | 基础路径 |
| `onChange` | `function` | - | 菜单项点击回调 |
