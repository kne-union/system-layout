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

- **布局组件（SystemLayout）**：提供灵活的页面布局，支持桌面端和移动端两种模式。桌面端包含可展开/收起的侧边菜单，移动端为侧滑抽屉菜单 + 底部工具栏。
- **页面组件（Page）**：提供标题栏、返回按钮、操作按钮组、加载状态等功能，支持函数式子组件自定义渲染。移动端标题栏滚动时自动收缩为胶囊样式。
- **菜单管理（Menu）**：支持分组、图标、自定义激活项、自定义点击回调，菜单项可配置是否在移动端工具栏中显示。
- **用户信息（UserCard）**：在菜单头部展示用户信息，支持头像、姓名、邮箱、手机号、描述等字段。
- **AI 对话框**：桌面端支持小窗口和内嵌面板两种展示模式；移动端提供可拖动的悬浮入口按钮，点击后全屏展示对话框。
- **响应式工具**：透传 `@kne/responsive-utils` 的响应式工具，支持断点检测、媒体查询、弹层容器等功能。
- **主题适配**：提供 `themeToken` 配置，将常用 Ant Design 组件背景色设为透明，适配半透明背景风格。

#### 注意

* 请不要忘记引用包的样式

```js
import SystemLayout from '@kne/system-layout';
import '@kne/system-layout/dist/index.css';
```

#### TODO

- [x] 完成基础布局
- [x] 适配到移动端
- [ ] 完善桌面端 AI 对话框功能


### 示例(全屏)

#### 示例样式

```scss
/* 示例样式 - 移动端布局示例无需额外样式 */
```

#### 示例代码

- 基础布局
- 移动端基础布局示例，展示 SystemLayout 在 isMobile 模式下的菜单、工具栏、用户信息和页面内容
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),antd(antd)

```jsx
const { default: SystemLayout, Page } = _SystemLayout;
const { Flex, Card, Row, Col, Statistic, Progress, Tag, Typography } = antd;
const { Text, Title } = Typography;

const STATS = [
  { title: '待办任务', value: 8, suffix: '项', color: '#1677ff' },
  { title: '本月入职', value: 24, suffix: '人', color: '#52c41a' },
  { title: '待面试', value: 15, suffix: '场', color: '#faad14' },
  { title: '离职申请', value: 3, suffix: '份', color: '#ff4d4f' }
];

const ONBOARDING_STEPS = [
  { title: '完善个人资料', done: true },
  { title: '签署入职文件', done: true },
  { title: '领取办公设备', done: false },
  { title: '参加新人培训', done: false }
];

const BaseExample = () => {
  const doneCount = ONBOARDING_STEPS.filter(step => step.done).length;
  const percent = Math.round((doneCount / ONBOARDING_STEPS.length) * 100);

  return (
    <SystemLayout
      userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }}
      menu={{
        base: '/SystemLayout',
        items: [
          { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
          { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
          { group: 'HIRING', path: '/hiring/application', label: 'Application List', icon: 'icon-assignment' },
          { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' },
          { group: 'TALENT REVIEW', path: '/talent-review', label: 'Projects', icon: 'icon-manage_accounts' },
          { group: 'TALENT REVIEW', path: '/talent-review/employee', label: 'Employee', toolbar: true, icon: 'icon-groups_2' },
          { group: 'TALENT REVIEW', path: '/talent-review/ai-models', label: 'AI Models', icon: 'icon-network_intelligence' }
        ]
      }}
    >
      <Page
        title="Onboarding"
        buttonProps={{
          showLength: 1,
          list: [
            { type: 'primary', children: 'New' },
            { children: 'Options' }
          ]
        }}
      >
        <Flex vertical gap={16}>
          <Card styles={{ body: { padding: 20 } }} style={{ background: 'rgba(255,255,255,0.5)' }}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
              <Flex vertical gap={4}>
                <Title level={4} style={{ margin: 0 }}>
                  下午好，Lucy 👋
                </Title>
                <Text type="secondary">欢迎回到工作台，今天有 8 项待办事项等待处理。</Text>
              </Flex>
              <Tag color="processing" style={{ fontSize: 13, padding: '4px 12px' }}>
                入职进度 {percent}%
              </Tag>
            </Flex>
          </Card>

          <Row gutter={[12, 12]}>
            {STATS.map(stat => (
              <Col xs={12} md={6} key={stat.title}>
                <Card styles={{ body: { padding: 16 } }} style={{ background: 'rgba(255,255,255,0.5)' }}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    suffix={stat.suffix}
                    valueStyle={{ color: stat.color, fontSize: 24 }}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <Card title="入职清单" styles={{ body: { padding: 20 } }} style={{ background: 'rgba(255,255,255,0.5)' }}>
            <Flex vertical gap={16}>
              <Progress percent={percent} strokeColor={{ from: '#1677ff', to: '#52c41a' }} />
              <Flex vertical gap={10}>
                {ONBOARDING_STEPS.map(step => (
                  <Flex key={step.title} align="center" gap={10}>
                    <Tag color={step.done ? 'success' : 'default'} style={{ margin: 0 }}>
                      {step.done ? '已完成' : '待办'}
                    </Tag>
                    <Text delete={step.done} type={step.done ? 'secondary' : undefined}>
                      {step.title}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);

```

- Page 组件
- Page 组件的各种功能：返回按钮、自定义内容、仅头像 / 头像+操作、函数式子组件、加载状态、navbar/toolbar 控制等；内容区加长，便于在手机预览中滚动查看导航栏胶囊态
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),antd(antd)

```jsx
const { default: SystemLayout, Page } = _SystemLayout;
const { useState } = React;
const { Segmented, Button, Flex, Card, Alert, Descriptions, Empty, Tag, Typography } = antd;
const { Text } = Typography;

const DEMO_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy';

const MODE_OPTIONS = [
  { label: '基础', value: 'basic' },
  { label: '返回', value: 'back' },
  { label: 'Extra', value: 'extra' },
  { label: '仅头像', value: 'avatarOnly' },
  { label: '头像+操作', value: 'avatarActions' },
  { label: '无头像', value: 'noAvatar' },
  { label: '无右侧', value: 'noRight' },
  { label: '无填充', value: 'noPadding' },
  { label: '函数式', value: 'function' },
  { label: '无导航', value: 'noNavbar' },
  { label: '无工具栏', value: 'noToolbar' }
];

const MODE_TIPS = {
  basic: '标准页面：标题栏 + 操作按钮组 + 内容区。',
  back: '已启用返回按钮（back），点击会调用 navigate(-1)。',
  extra: '已自定义 extra 内容；移动端仍会在右侧保留头像。',
  avatarOnly: '仅展示用户头像：无 buttonProps / extra，移动端右侧只有头像胶囊。',
  avatarActions: '头像 + 额外操作：buttonProps 收起到「更多」，与头像并排；滚动后可看胶囊态。',
  noAvatar: '无用户头像：userInfo 不传 avatar，移动端右侧仅保留操作（更多）或为空。',
  noRight: '无右侧操作与头像：不传 buttonProps / extra / avatar，滚动后仅左侧标题胶囊。',
  noPadding: '已移除内容区内边距（noPadding），适合放置全屏地图、表格等。',
  function: '函数式子组件模式：Page 将渲染控制权交给 children 函数。',
  noNavbar: '已隐藏顶部导航栏（navbar=false）。',
  noToolbar: '已隐藏底部工具栏（toolbar=false）。'
};

const DEFAULT_BUTTON_PROPS = {
  showLength: 1,
  list: [
    { type: 'primary', children: 'New' },
    { children: 'Options' },
    { children: 'Export' }
  ]
};

const SCROLL_DEMO_ITEMS = [
  { title: '滚动观察点 1', tip: '继续向下滚动，观察顶部导航是否变为胶囊态' },
  { title: '滚动观察点 2', tip: '超过导航高度后，标题栏应收成毛玻璃胶囊' },
  { title: '滚动观察点 3', tip: '右侧操作区（更多 + 头像）也应出现悬浮胶囊' },
  { title: '滚动观察点 4', tip: '回顶后导航应恢复常态白底样式' },
  { title: '滚动观察点 5', tip: '可切换「仅头像 / 头像+操作」，对比右侧胶囊内容' },
  { title: '滚动观察点 6', tip: '手机预览下请在设备框内滚动，而不是滚动外层文档' },
  { title: '滚动观察点 7', tip: '胶囊态按钮为 link 样式，常态不强制改写按钮外观' },
  { title: '滚动观察点 8', tip: '内容足够长即可反复验证固定与收缩效果' }
];

const ModeSwitcher = ({ mode, setMode }) => (
  <Segmented block value={mode} onChange={setMode} options={MODE_OPTIONS} />
);

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' }
  ]
};

const FunctionParams = () => (
  <Descriptions column={1} size="small" bordered items={[
    { key: 'navbar', label: 'navbar', children: '导航栏元素' },
    { key: 'className', label: 'className', children: '内容区类名（含 noPadding 等）' },
    { key: 'render', label: 'render', children: '标准渲染函数，用于包裹自定义内容' },
    { key: 'pageLoading', label: 'pageLoading', children: '加载状态元素（含骨架屏）' }
  ]} />
);

const ScrollDemoList = () => (
  <Flex vertical gap={12}>
    <Alert
      type="success"
      showIcon
      message="滚动演示"
      description="在手机模式下向下滚动本页，可查看导航栏从常态切换为固定胶囊态的效果。"
    />
    {SCROLL_DEMO_ITEMS.map((item, index) => (
      <Card
        key={item.title}
        size="small"
        style={{ background: 'rgba(255,255,255,0.55)', minHeight: 120 }}
        title={
          <Flex align="center" gap={8}>
            <Tag color="blue">{index + 1}</Tag>
            <span>{item.title}</span>
          </Flex>
        }
      >
        <Text type="secondary">{item.tip}</Text>
        <div style={{ marginTop: 12, height: 48, borderRadius: 8, background: 'rgba(22,119,255,0.06)' }} />
      </Card>
    ))}
  </Flex>
);

const resolveButtonProps = mode => {
  if (mode === 'avatarOnly' || mode === 'extra' || mode === 'noRight') {
    return undefined;
  }
  if (mode === 'avatarActions' || mode === 'noAvatar') {
    return {
      showLength: 1,
      list: [
        { type: 'primary', children: '新建' },
        { children: '导入' },
        { children: '导出' }
      ]
    };
  }
  return DEFAULT_BUTTON_PROPS;
};

const BaseExample = () => {
  const [mode, setMode] = useState('basic');
  const [loading, setLoading] = useState(false);
  const buttonProps = resolveButtonProps(mode);
  const userInfo =
    mode === 'noAvatar' || mode === 'noRight'
      ? { name: 'Lucy L', email: 'lucy@company.com' }
      : { name: 'Lucy L', email: 'lucy@company.com', avatar: DEMO_AVATAR };

  return (
    <SystemLayout userInfo={userInfo} menu={menu}>
      <Page
        title="Page 组件演示"
        back={mode === 'back'}
        extra={mode === 'extra' ? <Button size="small" type="primary">自定义操作</Button> : null}
        noPadding={mode === 'noPadding'}
        navbar={mode !== 'noNavbar'}
        toolbar={mode !== 'noToolbar'}
        buttonProps={buttonProps}
      >
        {mode === 'function'
          ? ({ render, pageLoading }) => {
              if (loading) {
                return pageLoading;
              }
              return render({
                children: (
                  <Flex vertical gap={16}>
                    <ModeSwitcher mode={mode} setMode={setMode} />
                    <Alert type="info" showIcon message={MODE_TIPS.function} />
                    <Card size="small" title="children 函数参数">
                      <FunctionParams />
                    </Card>
                    <Button
                      type="primary"
                      loading={loading}
                      onClick={() => {
                        setLoading(true);
                        setTimeout(() => setLoading(false), 2000);
                      }}
                    >
                      模拟加载（展示骨架屏）
                    </Button>
                    <ScrollDemoList />
                  </Flex>
                )
              });
            }
          : (
            <Flex vertical gap={16}>
              <ModeSwitcher mode={mode} setMode={setMode} />
              {mode === 'noPadding' ? (
                <Flex vertical gap={12}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{ background: 'rgba(0,0,0,0.04)', height: 300, borderRadius: 8 }}
                  >
                    <Empty description="无内边距内容区（noPadding）" />
                  </Flex>
                  <ScrollDemoList />
                </Flex>
              ) : (
                <>
                  <Alert type="info" showIcon message={MODE_TIPS[mode]} />
                  <Card size="small" style={{ background: 'rgba(255,255,255,0.5)' }}>
                    <Descriptions column={1} size="small" items={[
                      { key: 'mode', label: '当前模式', children: mode },
                      {
                        key: 'avatar',
                        label: '头像',
                        children:
                          mode === 'avatarOnly'
                            ? '仅头像，无额外操作'
                            : mode === 'avatarActions'
                              ? '头像 + 更多操作'
                              : mode === 'noAvatar'
                                ? '无头像，仅更多操作'
                                : mode === 'noRight'
                                  ? '无右侧操作与头像'
                                  : '跟随当前模式'
                      },
                      { key: 'desc', label: '说明', children: 'Page 提供标题栏、返回按钮、操作按钮组与自定义内容。' },
                      { key: 'mobile', label: '移动端', children: '标题栏固定在顶部，向下滚动时收缩为胶囊样式。' }
                    ]} />
                  </Card>
                  <ScrollDemoList />
                </>
              )}
            </Flex>
          )}
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);

```

- AI 对话框
- 桌面端 AI 招聘助手示例：通过左侧菜单底部入口唤起，支持小窗口（small）与内嵌面板（inner）两种形态。对话框内实现了完整的聊天交互——消息列表、快捷提问、模拟应答，贴近简历筛选、面试安排、JD 生成、Offer 评估等真实招聘业务场景
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),antd(antd)

```jsx
const { default: SystemLayout, Page } = _SystemLayout;
const { useState, useRef, useEffect } = React;
const { Flex, Card, Input, Button, Avatar, Tag, Typography, Alert, Spin } = antd;
const { Text, Paragraph } = Typography;

// 模拟招聘助手的知识库应答：根据关键字返回贴近业务的回复
const answerByKeyword = question => {
  const text = question.toLowerCase();
  if (text.includes('简历') || text.includes('筛选')) {
    return '已为「高级前端工程师」筛选出 3 位高匹配候选人：\n1. 王伟 · 6 年经验 · React/TypeScript · 匹配度 92%\n2. 李静 · 5 年经验 · Vue/Node.js · 匹配度 87%\n3. 张磊 · 4 年经验 · React/微前端 · 匹配度 85%\n是否需要我自动发送面试邀约？';
  }
  if (text.includes('面试') || text.includes('安排') || text.includes('邀约')) {
    return '我可以协助安排面试。候选人王伟本周可预约的时间为：\n· 周三 14:00-15:00\n· 周四 10:00-11:00\n面试官张总监周三下午有空，建议约在周三 14:00，是否确认发送日程邀请？';
  }
  if (text.includes('jd') || text.includes('职位') || text.includes('描述')) {
    return '已根据「产品部-高级产品经理」生成 JD 草稿：\n【岗位职责】负责 B 端产品全生命周期管理，主导需求调研与方案设计；\n【任职要求】5 年以上 B 端产品经验，熟悉 SaaS 业务，具备良好的数据分析能力。\n需要我一键同步到招聘渠道吗？';
  }
  if (text.includes('offer') || text.includes('薪资')) {
    return '根据候选人当前薪资（月薪 28K）与我司薪酬带宽，建议 Offer 方案：\n· 月薪 32K × 15 薪\n· 签字费 20K\n该方案在同级别薪酬 P60 分位，具备竞争力。是否生成 Offer 审批单？';
  }
  return '我是招聘助手小 K，可以帮你筛选简历、安排面试、生成 JD、评估 Offer。你可以试着问我「帮我筛选前端简历」或「安排王伟的面试」。';
};

// 快捷提问，模拟真实招聘场景中的高频操作
const QUICK_PROMPTS = ['帮我筛选高级前端工程师的简历', '安排候选人王伟的面试', '生成产品经理的 JD', '评估王伟的 Offer 薪资'];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '你好，我是招聘助手小 K 👋\n本周你有 3 个职位在招、8 份简历待筛选。需要我帮你做点什么吗？'
    }
  ]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const send = question => {
    const content = (question ?? value).trim();
    if (!content || loading) {
      return;
    }
    setMessages(prev => [...prev, { role: 'user', content }]);
    setValue('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: answerByKeyword(content) }]);
      setLoading(false);
    }, 800);
  };

  return (
    <Flex vertical style={{ height: '100%' }}>
      <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px' }}>
        <Flex vertical gap={16}>
          {messages.map((msg, index) => (
            <Flex key={index} gap={8} align="flex-start" justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
              {msg.role === 'ai' && <Avatar style={{ background: '#1677ff', flex: '0 0 auto' }}>K</Avatar>}
              <div
                style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: 10,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: msg.role === 'user' ? '#1677ff' : 'rgba(255,255,255,0.9)',
                  color: msg.role === 'user' ? '#fff' : 'inherit'
                }}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && <Avatar style={{ background: '#52c41a', flex: '0 0 auto' }}>我</Avatar>}
            </Flex>
          ))}
          {loading && (
            <Flex gap={8} align="center">
              <Avatar style={{ background: '#1677ff', flex: '0 0 auto' }}>K</Avatar>
              <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.9)' }}>
                <Spin size="small" /> <Text type="secondary">小 K 正在思考…</Text>
              </div>
            </Flex>
          )}
        </Flex>
      </div>

      <Flex vertical gap={10} style={{ flex: '0 0 auto', padding: '8px 16px 12px' }}>
        <Flex wrap="wrap" gap={8}>
          {QUICK_PROMPTS.map(prompt => (
            <Tag
              key={prompt}
              color="blue"
              style={{ cursor: 'pointer', margin: 0, padding: '2px 10px', borderRadius: 12 }}
              onClick={() => send(prompt)}
            >
              {prompt}
            </Tag>
          ))}
        </Flex>

        <Flex gap={8}>
          <Input.TextArea
            value={value}
            onChange={e => setValue(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="输入你的问题，回车发送…"
            onPressEnter={e => {
              e.preventDefault();
              send();
            }}
          />
          <Button type="primary" loading={loading} onClick={() => send()}>
            发送
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'HIRING', path: '/hiring/application', label: 'Application List', icon: 'icon-assignment' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' }
  ]
};

const BaseExample = () => {
  return (
    <SystemLayout
      userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }}
      menu={menu}
      aiDialog={{
        title: '招聘助手 · 小 K',
        content: <AIAssistant />
      }}
    >
      <Page title="AI 招聘助手">
        <Flex vertical gap={16}>
          <Alert
            type="info"
            showIcon
            message="如何唤起招聘助手"
            description={
              <span>
                <b>桌面端</b>：点击左侧菜单<b>底部的 AI 入口图标</b>，对话框支持两种形态：
                <br />· <b>小窗口（small）</b>：悬浮在左下角，不遮挡主内容；
                <br />· <b>内嵌面板（inner）</b>：点击小窗口右上角的展开图标，助手会嵌入到页面左侧，与内容并排展示。
                <br />
                <b>移动端</b>：点击右下角<b>可拖动的悬浮按钮</b>（可自由拖拽调整位置），以全屏形式展示对话框。
              </span>
            }
          />
          <Card title="招聘助手能做什么" styles={{ body: { padding: 20 } }} style={{ background: 'rgba(255,255,255,0.5)' }}>
            <Flex vertical gap={12}>
              <Paragraph style={{ margin: 0 }}>
                招聘助手小 K 内置在布局中，可在任意页面随时调用，帮助 HR 高效处理日常招聘工作：
              </Paragraph>
              <Flex vertical gap={8}>
                <Text>· 智能筛选简历，按岗位匹配度排序推荐候选人</Text>
                <Text>· 协调面试官与候选人的空闲时间，一键发送日程邀约</Text>
                <Text>· 根据部门和职级自动生成岗位 JD 草稿</Text>
                <Text>· 结合薪酬带宽评估 Offer 方案，生成审批单</Text>
              </Flex>
              <Text type="secondary">提示：在对话框中试着输入「帮我筛选前端简历」或点击快捷提问标签。</Text>
            </Flex>
          </Card>
        </Flex>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);

```

- 滚动加载
- 结合 @kne/scroll-loader 在 Page 内实现整页下拉无限加载：候选人列表随页面滚动到底部自动加载下一页，支持关键字搜索与阶段筛选，并根据 useIsMobile 响应式切换布局——移动端整行显示，PC 端使用 antd Masonry 瀑布流多列展示（卡片高度不统一）
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),_ScrollLoader(@kne/scroll-loader)[import * as _ScrollLoader from "@kne/scroll-loader"],(@kne/scroll-loader/dist/index.css),antd(antd)

```jsx
const { default: SystemLayout, Page, useIsMobile } = _SystemLayout;
const { FetchScrollLoader } = _ScrollLoader;
const { Flex, Avatar, Tag, Typography, Input, Select, Progress, Empty, Divider, Masonry } = antd;
const { useState } = React;
const { Text } = Typography;

const STAGES = [
  { value: 'screening', label: '简历筛选', color: 'default' },
  { value: 'interview', label: '面试中', color: 'processing' },
  { value: 'offer', label: '已发 Offer', color: 'success' },
  { value: 'rejected', label: '未通过', color: 'error' }
];

const POSITIONS = [
  { title: '高级前端工程师', dept: '技术部' },
  { title: '产品经理', dept: '产品部' },
  { title: 'UI/UX 设计师', dept: '设计部' },
  { title: '数据分析师', dept: '数据部' },
  { title: '增长运营专员', dept: '运营部' }
];

const FIRST_NAMES = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明'];
const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林'];

const AVATAR_COLORS = ['#1677ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2'];

const SKILLS = ['React', 'Vue', 'TypeScript', 'Node.js', 'Figma', '数据分析', 'Python', '项目管理', 'SQL', '增长策略', 'A/B 测试', 'UI 设计'];

// 长度不一的自我介绍，用于制造瀑布流所需的高度差异
const BIOS = [
  '专注体验设计，擅长从 0 到 1 搭建产品。',
  '有丰富的团队协作经验，能够快速融入并推动项目落地，善于在复杂需求中拆解优先级、平衡各方诉求并持续交付高质量成果。',
  '注重数据驱动决策。',
  '热爱技术钻研，长期关注前沿趋势，乐于分享与沉淀方法论，希望在更大的舞台上创造价值，同时帮助团队成员共同成长。',
  ''
];

// 模拟候选人列表接口：支持关键字搜索与阶段筛选，返回分页数据
const mockCandidateList = ({ data = {} }) => {
  const { currentPage = 1, perPage = 12, keyword, stage } = data;
  return new Promise(resolve => {
    const allCandidates = Array.from({ length: 128 }, (_, i) => {
      const position = POSITIONS[i % POSITIONS.length];
      const stageInfo = STAGES[i % STAGES.length];
      return {
        id: i + 1,
        name: &#96;${SURNAMES[i % SURNAMES.length]}${FIRST_NAMES[(i * 3) % FIRST_NAMES.length]}&#96;,
        position: position.title,
        department: position.dept,
        stage: stageInfo.value,
        matchScore: 60 + ((i * 7) % 40),
        experience: 1 + (i % 12),
        location: ['北京', '上海', '深圳', '杭州', '广州', '成都'][i % 6],
        appliedAt: &#96;2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}&#96;,
        skills: SKILLS.slice((i * 2) % SKILLS.length, ((i * 2) % SKILLS.length) + 2 + (i % 4)),
        bio: BIOS[i % BIOS.length]
      };
    });

    let filtered = allCandidates;
    if (keyword) {
      filtered = filtered.filter(item => item.name.includes(keyword) || item.position.includes(keyword));
    }
    if (stage) {
      filtered = filtered.filter(item => item.stage === stage);
    }

    const start = (currentPage - 1) * perPage;
    const pageData = filtered.slice(start, start + perPage);

    setTimeout(() => {
      resolve({ totalCount: filtered.length, pageData });
    }, 700);
  });
};

const getStageInfo = value => STAGES.find(item => item.value === value) || STAGES[0];

const getScoreColor = score => (score >= 90 ? '#52c41a' : score >= 75 ? '#1677ff' : '#faad14');

// 移动端：整行横向布局（头像 + 信息 + 匹配度）
const CandidateRow = ({ item }) => {
  const stageInfo = getStageInfo(item.stage);
  return (
    <Flex
      align="center"
      gap={16}
      style={{
        padding: 16,
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: 12
      }}
    >
      <Avatar size={48} style={{ backgroundColor: AVATAR_COLORS[item.id % AVATAR_COLORS.length], flex: 'none' }}>
        {item.name.slice(0, 1)}
      </Avatar>
      <Flex vertical gap={6} flex={1} style={{ minWidth: 0 }}>
        <Flex align="center" gap={8} wrap="wrap">
          <Text strong style={{ fontSize: 15 }}>
            {item.name}
          </Text>
          <Tag color={stageInfo.color}>{stageInfo.label}</Tag>
        </Flex>
        <Flex align="center" gap={8} wrap="wrap">
          <Text type="secondary" style={{ fontSize: 13 }}>
            {item.position}
          </Text>
          <Divider type="vertical" style={{ margin: 0 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {item.department}
          </Text>
          <Divider type="vertical" style={{ margin: 0 }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            {item.location} · {item.experience} 年经验
          </Text>
        </Flex>
        <Text type="secondary" style={{ fontSize: 12 }}>
          投递于 {item.appliedAt}
        </Text>
      </Flex>
      <Flex vertical align="center" gap={4} style={{ flex: 'none', width: 96 }}>
        <Progress
          type="circle"
          size={52}
          percent={item.matchScore}
          strokeColor={getScoreColor(item.matchScore)}
          format={percent => &#96;${percent}&#96;}
        />
        <Text type="secondary" style={{ fontSize: 12 }}>
          匹配度
        </Text>
      </Flex>
    </Flex>
  );
};

// PC 端：卡片纵向布局，用于瀑布流展示（内容长度不一，高度自然不统一）
const CandidateCard = ({ item }) => {
  const stageInfo = getStageInfo(item.stage);
  return (
    <Flex
      vertical
      gap={12}
      style={{
        padding: 16,
        background: 'rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        borderRadius: 12
      }}
    >
      <Flex align="center" gap={12}>
        <Avatar size={44} style={{ backgroundColor: AVATAR_COLORS[item.id % AVATAR_COLORS.length], flex: 'none' }}>
          {item.name.slice(0, 1)}
        </Avatar>
        <Flex vertical gap={4} flex={1} style={{ minWidth: 0 }}>
          <Text strong ellipsis style={{ fontSize: 15 }}>
            {item.name}
          </Text>
          <Tag color={stageInfo.color} style={{ margin: 0, width: 'fit-content' }}>
            {stageInfo.label}
          </Tag>
        </Flex>
        <Progress
          type="circle"
          size={48}
          percent={item.matchScore}
          strokeColor={getScoreColor(item.matchScore)}
          format={percent => &#96;${percent}&#96;}
        />
      </Flex>
      <Flex vertical gap={4}>
        <Text type="secondary" ellipsis style={{ fontSize: 13 }}>
          {item.position} · {item.department}
        </Text>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {item.location} · {item.experience} 年经验
        </Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          投递于 {item.appliedAt}
        </Text>
      </Flex>
      {item.bio ? (
        <Text style={{ fontSize: 13 }}>{item.bio}</Text>
      ) : null}
      <Flex gap={6} wrap="wrap">
        {item.skills.map(skill => (
          <Tag key={skill} style={{ margin: 0 }}>
            {skill}
          </Tag>
        ))}
      </Flex>
    </Flex>
  );
};

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'HIRING', path: '/hiring/application', label: 'Application List', toolbar: true, icon: 'icon-assignment' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' }
  ]
};

const BaseExample = () => {
  const isMobile = useIsMobile();
  const [keyword, setKeyword] = useState('');
  const [stage, setStage] = useState(undefined);

  return (
    <SystemLayout userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }} menu={menu}>
      <Page title="候选人列表">
        <FetchScrollLoader
          useSimpleBar={false}
          api={{ loader: mockCandidateList }}
          searchProps={{ keyword, stage }}
          getSearchProps={props => {
            const result = {};
            if (props.keyword) result.keyword = props.keyword;
            if (props.stage) result.stage = props.stage;
            return result;
          }}
          pagination={{ paramsType: 'data', current: 'currentPage', pageSizeName: 'perPage', pageSize: 12 }}
          completeTips="— 已加载全部候选人 —"
          render={({ fetchApi, children }) => (
            <Flex vertical gap={16}>
              <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                <Flex gap={12} align="center" wrap="wrap">
                  <Input.Search
                    placeholder="搜索姓名或职位"
                    allowClear
                    onSearch={setKeyword}
                    style={{ width: 220 }}
                  />
                  <Select
                    placeholder="按阶段筛选"
                    allowClear
                    value={stage}
                    onChange={setStage}
                    style={{ width: 140 }}
                    options={STAGES.map(({ value, label }) => ({ value, label }))}
                  />
                </Flex>
                <Text type="secondary">共 {fetchApi.data.totalCount} 位候选人</Text>
              </Flex>
              <Divider style={{ margin: 0 }} />
              {children}
            </Flex>
          )}
        >
          {({ list }) => {
            if (!list || list.length === 0) {
              return (
                <Flex justify="center" style={{ padding: 48 }}>
                  <Empty description="没有符合条件的候选人" />
                </Flex>
              );
            }
            if (isMobile) {
              return (
                <Flex vertical gap={12}>
                  {list.map(item => (
                    <CandidateRow key={item.id} item={item} />
                  ))}
                </Flex>
              );
            }
            return (
              <Masonry
                columns={{ xs: 1, sm: 2, lg: 3, xxl: 4 }}
                gutter={12}
                items={list.map(item => ({ key: item.id, data: item }))}
                itemRender={({ data }) => <CandidateCard item={data} />}
              />
            );
          }}
        </FetchScrollLoader>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);

```

- 表格列表页
- 在 SystemLayout + Page 中接入 @kne/table-page：用 useScrollElement 绑定页面滚动实现 sticky 表头，覆盖 TablePage 自带的 tab / filter / search、分页、排序与批量操作，贴近招聘候选人列表场景
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),_TablePage(@kne/table-page)[import * as _TablePage from "@kne/table-page"],(@kne/table-page/dist/index.css),_ReactFilter(@kne/react-filter)[import * as _ReactFilter from "@kne/react-filter"],(@kne/react-filter/dist/index.css),antd(antd)

```jsx
const { default: SystemLayout, Page, useScrollElement, useIsMobile } = _SystemLayout;
const { default: TablePage, Table } = _TablePage;
const { fields } = _ReactFilter;
const { SuperSelectFilterItem } = fields;
const { Flex, Tag, message, Button } = antd;
const { useMemo } = React;

const TOTAL = 96;
const PAGE_HEADER_HEIGHT = 48;

const STAGES = [
  { value: 'screening', label: '简历筛选', color: 'default' },
  { value: 'interview', label: '面试中', color: 'processing' },
  { value: 'offer', label: '已发 Offer', color: 'success' },
  { value: 'rejected', label: '未通过', color: 'error' }
];

const DEPARTMENTS = ['技术部', '产品部', '设计部', '数据部', '运营部'];

const POSITIONS = [
  { title: '高级前端工程师', dept: '技术部' },
  { title: '产品经理', dept: '产品部' },
  { title: 'UI/UX 设计师', dept: '设计部' },
  { title: '数据分析师', dept: '数据部' },
  { title: '增长运营专员', dept: '运营部' }
];

const FIRST_NAMES = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明'];
const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林'];

const stageMap = Object.fromEntries(
  STAGES.map(({ value, label, color }) => [value, { type: color === 'default' ? 'default' : color, text: label }])
);

const stageOptions = STAGES.map(({ value, label }) => ({ value, label }));
const departmentOptions = DEPARTMENTS.map(item => ({ value: item, label: item }));
const locationOptions = ['北京', '上海', '深圳', '杭州', '广州', '成都'].map(item => ({ value: item, label: item }));

const buildCandidate = index => {
  const position = POSITIONS[index % POSITIONS.length];
  const stage = STAGES[index % STAGES.length];
  return {
    id: &#96;CAND${String(index + 1).padStart(4, '0')}&#96;,
    name: &#96;${SURNAMES[index % SURNAMES.length]}${FIRST_NAMES[(index * 3) % FIRST_NAMES.length]}&#96;,
    position: position.title,
    department: position.dept,
    stage: stage.value,
    matchScore: 60 + ((index * 7) % 40),
    experience: 1 + (index % 12),
    location: ['北京', '上海', '深圳', '杭州', '广州', '成都'][index % 6],
    appliedAt: &#96;2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}&#96;,
    phone: &#96;138${String(index).padStart(8, '0')}&#96;,
    email: &#96;candidate${index + 1}@mail.com&#96;
  };
};

const normalizeFilterValue = value => {
  if (value == null) {
    return value;
  }
  return Array.isArray(value) ? value[0] : value;
};

const applyFilters = (list, data, requestParams) => {
  const params = Object.assign({}, requestParams?.data, data);
  let result = list;

  if (params.keyword) {
    const keyword = String(params.keyword).toLowerCase();
    result = result.filter(
      item => item.name.includes(params.keyword) || item.position.toLowerCase().includes(keyword) || item.id.toLowerCase().includes(keyword)
    );
  }

  const stage = normalizeFilterValue(params.stage);
  if (stage) {
    result = result.filter(item => item.stage === stage);
  }

  const department = normalizeFilterValue(params.department);
  if (department) {
    result = result.filter(item => item.department === department);
  }

  const location = normalizeFilterValue(params.location);
  if (location) {
    result = result.filter(item => item.location === location);
  }

  return result;
};

const columns = [
  {
    name: 'id',
    title: '候选人编号',
    width: 140,
    min: 120,
    max: 200,
    fixed: 'left',
    renderType: 'main',
    primary: true,
    onClick: ({ item }) => {
      message.info(&#96;查看候选人：${item}&#96;);
    }
  },
  { name: 'name', title: '姓名', width: 100, min: 80, max: 140, renderType: 'main' },
  { name: 'position', title: '应聘职位', width: 160, min: 120, max: 220 },
  { name: 'department', title: '用人部门', width: 120, min: 100, max: 180 },
  {
    name: 'stage',
    title: '阶段',
    width: 110,
    renderType: 'status',
    getValueOf: item => stageMap[item.stage] || { type: 'default', text: item.stage }
  },
  {
    name: 'matchScore',
    title: '匹配度',
    width: 100,
    min: 80,
    max: 140,
    sort: true,
    render: value => &#96;${value}%&#96;
  },
  { name: 'experience', title: '经验', width: 90, render: value => &#96;${value} 年&#96; },
  { name: 'location', title: '城市', width: 90 },
  { name: 'appliedAt', title: '投递日期', width: 120, format: 'date', sort: true },
  { name: 'phone', title: '手机号', width: 140, render: value => value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') },
  { name: 'email', title: '邮箱', width: 200, ellipsis: true, hidden: true },
  {
    name: 'options',
    title: '操作',
    renderType: 'options',
    fixed: 'right',
    width: 160,
    min: 120,
    max: 200,
    getValueOf: item => {
      const actions = [
        { children: '查看', onClick: () => message.info(&#96;查看 ${item.name}&#96;) },
        { children: '安排面试', onClick: () => message.success(&#96;已为 ${item.name} 安排面试&#96;) }
      ];
      if (item.stage !== 'rejected' && item.stage !== 'offer') {
        actions.push({
          children: '淘汰',
          onClick: () => message.warning(&#96;已淘汰 ${item.name}&#96;)
        });
      }
      return actions;
    }
  }
];

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'HIRING', path: '/hiring/application', label: 'Application List', toolbar: true, icon: 'icon-assignment' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' }
  ]
};

const CandidateTable = () => {
  const getScrollElement = useScrollElement();
  const isMobile = useIsMobile();
  const tableRef = React.useRef();
  const allCandidates = useMemo(() => Array.from({ length: TOTAL }, (_, index) => buildCandidate(index)), []);
  const { selectedRows, getRowSelection } = Table.useSelectedRow({ rowKey: 'id' });
  const { sortRender, mobileSortToolbar } = Table.useSort({
    defaultSort: [{ name: 'appliedAt', sort: 'DESC' }],
    onSortChange: newSort => {
      tableRef.current?.reload({
        data: { currentPage: 1, sort: newSort }
      });
    }
  });

  return (
    <TablePage
      ref={tableRef}
      name="system-layout-candidate-table"
      sticky
      scrollTopInset={isMobile ? PAGE_HEADER_HEIGHT : 0}
      getScrollContainer={getScrollElement}
      scroll={{ x: 1400 }}
      size="large"
      renderMobile
      sortRender={sortRender}
      mobileSortToolbar={mobileSortToolbar}
      rowSelection={getRowSelection(allCandidates)}
      selectedRows={selectedRows}
      search={{ name: 'keyword', label: '关键词', placeholder: '搜索姓名/职位/编号', style: { width: 220 } }}
      tab={{
        name: 'stage',
        label: '阶段',
        list: stageOptions
      }}
      tabProps={{
        tabBarExtraContent: (
          <Button type="link" size="small" onClick={() => message.info('新建招聘需求')}>
            新建需求
          </Button>
        )
      }}
      filter={{
        list: [
          [
            {
              type: SuperSelectFilterItem,
              props: { name: 'department', label: '部门', single: true, options: departmentOptions }
            },
            {
              type: SuperSelectFilterItem,
              props: { name: 'location', label: '城市', single: true, options: locationOptions }
            }
          ]
        ],
        displayLine: 1
      }}
      batchActions={[
        {
          key: 'export',
          label: '批量导出',
          onClick: ({ selectedRowKeys }) => {
            message.info(&#96;正在导出 ${selectedRowKeys.length} 位候选人&#96;);
          }
        },
        {
          key: 'notify',
          label: '批量通知',
          onClick: ({ selectedRowKeys }) => {
            message.success(&#96;已通知 ${selectedRowKeys.length} 位候选人&#96;);
          }
        }
      ]}
      pagination={{
        open: true,
        pageSize: 10,
        cachePageSize: false,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['10', '20', '50']
      }}
      dataFormat={data => ({
        list: data.pageData,
        total: data.totalCount,
        data
      })}
      loader={({ data, requestParams }) => {
        const currentPage = Number(data?.currentPage ?? requestParams?.data?.currentPage) || 1;
        const perPage = Number(data?.perPage ?? requestParams?.data?.perPage) || 10;
        const sortParams = data?.sort ?? requestParams?.data?.sort ?? [{ name: 'appliedAt', sort: 'DESC' }];
        const filtered = applyFilters(allCandidates, data, requestParams);
        const sorted = sortParams.length ? Table.sortDataSource(filtered, sortParams, columns) : filtered;
        const start = (currentPage - 1) * perPage;

        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              pageData: sorted.slice(start, start + perPage),
              totalCount: filtered.length
            });
          }, 400);
        });
      }}
      columns={columns}
    />
  );
};

const BaseExample = () => {
  return (
    <SystemLayout userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }} menu={menu}>
      <Page
        title="候选人列表"
        buttonProps={{
          showLength: 1,
          list: [
            { type: 'primary', children: '新建候选人' },
            { children: '导入简历' }
          ]
        }}
      >
        <Flex vertical gap={12}>
          <Flex gap={8} wrap="wrap" align="center">
            <Tag color="blue">Layout 滚动</Tag>
            <span style={{ color: '#666', fontSize: 13 }}>
              通过 <code>useScrollElement</code> 绑定 Layout 滚动容器；使用 TablePage 自带的 <code>tab</code> / <code>filter</code> /{' '}
              <code>search</code> 与分页
            </span>
          </Flex>
          <CandidateTable />
        </Flex>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);

```

- Tenant 租户设置
- 参考 telent-coach：Authenticate + SystemLayout + Tenant@Setting，演示公司/组织/用户/权限设置页；preset 已注册 components-admin，接口走 mock 数据
- _SystemLayout(@kne/current-lib_system-layout)[import * as _SystemLayout from "@kne/system-layout"],(@kne/current-lib_system-layout/dist/index.css),remoteLoader(@kne/remote-loader),reactRouterDom(react-router-dom),icons(@ant-design/icons),antd(antd)

```jsx
const { default: SystemLayout, Page } = _SystemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { Routes, Route, Navigate, useLocation } = reactRouterDom;
const { UserSwitchOutlined, LogoutOutlined, PartitionOutlined, UserOutlined, SafetyCertificateOutlined, HomeOutlined } = icons;
const { message } = antd;

/**
 * 参考 telent-coach/src/components/Tenant：
 * Authenticate 拉取租户用户信息 → SystemLayout 承载菜单 → Setting.* 用 Page 渲染设置页
 * 接口走 example/src/preset.js 中注册的 mock apis.tenant.*
 *
 * menu.base 取当前示例路由前缀（/:id/*），避免跳到 /SystemLayout 后丢失示例页
 */
const TenantDemoInner = createWithRemoteLoader({
  modules: [
    'components-admin:Tenant@Authenticate',
    'components-admin:Tenant@Setting',
    'components-core:Permissions',
    'components-core:Global@SetGlobal'
  ]
})(({ remoteModules, base }) => {
  const [Authenticate, Setting, Permissions, SetGlobal] = remoteModules;

  return (
    <Authenticate>
      {({ global }) => {
        const { tenantUserInfo, tenant } = global;
        return (
          <SetGlobal globalKey="tenant" value={tenant}>
            <SetGlobal globalKey="userInfo" value={{ tenantUserInfo, tenant }}>
              <Permissions request={['tenant']} type="error">
                <SystemLayout
                  logo={{ id: tenant?.logo, src: tenant?.logo }}
                  userInfo={tenantUserInfo}
                  background="linear-gradient(180deg, #E8DCDF, #E1D1E3, #DED7EF, #D5E0F1)"
                  menu={{
                    base,
                    items: [
                      {
                        path: '/',
                        label: '工作台',
                        toolbar: true,
                        icon: <HomeOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '公司信息',
                        path: '/setting/company',
                        icon: { type: 'gongsi' }
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '组织架构',
                        path: '/setting/org',
                        icon: <PartitionOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '用户管理',
                        path: '/setting/user',
                        toolbar: true,
                        icon: <UserOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '权限管理',
                        path: '/setting/permission',
                        icon: <SafetyCertificateOutlined />
                      },
                      {
                        group: 'account',
                        groupLabel: '账号',
                        label: '切换租户',
                        icon: <UserSwitchOutlined />,
                        onClick: () => message.info('示例环境：切换租户（mock）')
                      },
                      {
                        group: 'account',
                        groupLabel: '账号',
                        label: '退出登录',
                        icon: <LogoutOutlined />,
                        onClick: () => message.info('示例环境：退出登录（mock）')
                      }
                    ]
                  }}
                >
                  <Routes>
                    <Route
                      path={base}
                      element={
                        <Page title="工作台">
                          <div style={{ padding: 16, color: '#666', lineHeight: 1.8 }}>
                            <p>
                              当前租户：<strong>{tenant?.name}</strong>
                            </p>
                            <p>
                              当前用户：<strong>{tenantUserInfo?.name}</strong>（{tenantUserInfo?.email}）
                            </p>
                            <p>
                              左侧菜单进入「系统设置」可体验 components-admin:Tenant@Setting 的公司 / 组织 / 用户 / 权限页面，接口均走
                              mock 数据。
                            </p>
                          </div>
                        </Page>
                      }
                    />
                    <Route
                      path={&#96;${base}/setting/company&#96;}
                      element={<Setting.Company>{({ title, children }) => <Page title={title}>{children}</Page>}</Setting.Company>}
                    />
                    <Route
                      path={&#96;${base}/setting/org&#96;}
                      element={
                        <Setting.Org baseUrl={&#96;${base}/setting&#96;}>
                          {({ title, children }) => <Page title={title}>{children}</Page>}
                        </Setting.Org>
                      }
                    />
                    <Route
                      path={&#96;${base}/setting/user&#96;}
                      element={
                        <Setting.User>
                          {({ title, titleExtra, children }) => (
                            <Page title={title} extra={titleExtra}>
                              {children}
                            </Page>
                          )}
                        </Setting.User>
                      }
                    />
                    <Route
                      path={&#96;${base}/setting/permission&#96;}
                      element={
                        <Setting.Permission>
                          {({ title, titleExtra, children }) => (
                            <Page title={title} extra={titleExtra}>
                              {children}
                            </Page>
                          )}
                        </Setting.Permission>
                      }
                    />
                    <Route path="*" element={<Navigate to={base} replace />} />
                  </Routes>
                </SystemLayout>
              </Permissions>
            </SetGlobal>
          </SetGlobal>
        );
      }}
    </Authenticate>
  );
});

const BaseExample = () => {
  const { pathname } = useLocation();
  // /:exampleId/... → 取第一段作为示例 base，保证菜单导航仍落在当前示例 :id/* 下
  const base = '/' + (pathname.replace(/^\//, '').split('/')[0] || 'Tenant 租户设置');
  return <TenantDemoInner base={base} />;
};

render(<BaseExample />);

```

- 图标字体
- 项目内置的图标字体列表
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
| `aiDialog` | `object` | `null` | AI 对话框配置，包含 `title` 和 `content` 字段 |
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
