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