const { default: SystemLayout, Page, BarChartIcon, Card, CARD_THEME } = _SystemLayout;
const { useState } = React;
const { Segmented, Button, Flex, Descriptions, Empty } = antd;

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
  { label: '无工具栏', value: 'noToolbar' },
  { label: '底栏', value: 'footer' }
];

const MODE_TIPS = {
  basic: '标准页面：标题栏 + 操作按钮组 + 内容区。',
  back: '已启用返回按钮（back），点击会调用 navigate(-1)。二级页左侧只有返回，移动端点右侧头像打开菜单。',
  extra: '已自定义 extra 内容；移动端仍会在右侧保留头像。',
  avatarOnly: '仅展示用户头像：无 buttonProps / extra，移动端右侧只有头像圆钮，点击打开菜单。',
  avatarActions: '头像 + 额外操作：buttonProps 收起到「更多」，与头像并排；滚动后可看胶囊态。',
  noAvatar: '无用户头像：userInfo 不传 avatar，移动端头像圆钮显示默认头像，仍可点击打开菜单。',
  noRight: '无右侧操作：不传 buttonProps / extra / avatar，移动端右侧仅保留默认头像圆钮。',
  noPadding: '已移除内容区内边距（noPadding），适合放置全屏地图、表格等。',
  function: '函数式子组件模式：Page 将渲染控制权交给 children 函数。',
  noNavbar: '已隐藏顶部导航栏（navbar=false）。',
  noToolbar: '已隐藏底部工具栏（toolbar=false）。',
  footer: 'Page.Footer 贴在内容列底部。移动端无 Toolbar 时贴住页面底边；有 Toolbar 时两者合并为同一行，点左侧圆钮展开导航、点右侧圆钮切回底栏，展开导航后滚动页面会自动切回底栏。'
};

const DEFAULT_BUTTON_PROPS = {
  showLength: 1,
  list: [{ type: 'primary', children: 'New' }, { children: 'Options' }, { children: 'Export' }]
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
  <Flex wrap gap={8} role="radiogroup" aria-label="演示模式">
    {MODE_OPTIONS.map(option => (
      <Button key={option.value} size="small" role="radio" aria-checked={mode === option.value} type={mode === option.value ? 'primary' : 'default'} onClick={() => setMode(option.value)}>
        {option.label}
      </Button>
    ))}
  </Flex>
);

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: <BarChartIcon /> }
  ]
};

const FunctionParams = () => (
  <Descriptions
    column={1}
    size="small"
    bordered
    items={[
      { key: 'navbar', label: 'navbar', children: '导航栏元素' },
      { key: 'className', label: 'className', children: '内容区类名（含 noPadding 等）' },
      { key: 'render', label: 'render', children: '标准渲染函数，用于包裹自定义内容' },
      { key: 'pageLoading', label: 'pageLoading', children: '加载状态元素（含骨架屏）' }
    ]}
  />
);

const ScrollDemoList = () => (
  <Flex vertical gap={12}>
    <Card theme={CARD_THEME.tint} title="滚动演示" description="在手机模式下向下滚动本页，可查看导航栏从常态切换为固定胶囊态的效果。" />
    {SCROLL_DEMO_ITEMS.map((item, index) => (
      <Card key={item.title} theme={CARD_THEME.solid} subtitle={`观察点 ${index + 1}`} title={item.title} description={item.tip}>
        <div style={{ height: 48, borderRadius: 8, background: 'var(--sl-primary-1)' }} />
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
      list: [{ type: 'primary', children: '新建' }, { children: '导入' }, { children: '导出' }]
    };
  }
  return DEFAULT_BUTTON_PROPS;
};

const BaseExample = () => {
  const [mode, setMode] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [footerToolbar, setFooterToolbar] = useState(true);
  const buttonProps = resolveButtonProps(mode);
  const userInfo = mode === 'noAvatar' || mode === 'noRight' ? { name: 'Lucy L', email: 'lucy@company.com' } : { name: 'Lucy L', email: 'lucy@company.com', avatar: DEMO_AVATAR };

  return (
    <SystemLayout userInfo={userInfo} menu={menu}>
      <Page
        title="Page 组件演示"
        back={mode === 'back'}
        extra={
          mode === 'extra' ? (
            <Button size="small" type="primary">
              自定义操作
            </Button>
          ) : null
        }
        noPadding={mode === 'noPadding'}
        navbar={mode !== 'noNavbar'}
        toolbar={mode === 'noToolbar' ? false : mode === 'footer' ? footerToolbar : true}
        buttonProps={buttonProps}
      >
        {mode === 'function' ? (
          ({ render, pageLoading }) => {
            if (loading) {
              return pageLoading;
            }
            return render({
              children: (
                <Flex vertical gap={16}>
                  <ModeSwitcher mode={mode} setMode={setMode} />
                  <Card theme={CARD_THEME.tint} description={MODE_TIPS.function} />
                  <Card theme={CARD_THEME.glass} padding={16} title="children 函数参数">
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
        ) : (
          <>
            <Flex vertical gap={16}>
              <ModeSwitcher mode={mode} setMode={setMode} />
              {mode === 'footer' ? (
                <Segmented
                  block
                  value={footerToolbar ? 'withToolbar' : 'withoutToolbar'}
                  onChange={value => setFooterToolbar(value === 'withToolbar')}
                  options={[
                    { label: '有 Toolbar', value: 'withToolbar' },
                    { label: '无 Toolbar', value: 'withoutToolbar' }
                  ]}
                />
              ) : null}
              {mode === 'noPadding' ? (
                <Flex vertical gap={12}>
                  <Flex align="center" justify="center" style={{ background: 'var(--sl-field-bg)', height: 300 }}>
                    <Empty description="无内边距内容区（noPadding）" />
                  </Flex>
                  <ScrollDemoList />
                </Flex>
              ) : (
                <>
                  <Card theme={CARD_THEME.tint} description={MODE_TIPS[mode]} />
                  <Card theme={CARD_THEME.glass} padding={16}>
                    <Descriptions
                      column={1}
                      size="small"
                      items={[
                        { key: 'mode', label: '当前模式', children: mode },
                        {
                          key: 'avatar',
                          label: '头像',
                          children: mode === 'avatarOnly' ? '仅头像，无额外操作' : mode === 'avatarActions' ? '头像 + 更多操作' : mode === 'noAvatar' ? '无头像，仅更多操作' : mode === 'noRight' ? '无右侧操作与头像' : '跟随当前模式'
                        },
                        { key: 'desc', label: '说明', children: 'Page 提供标题栏、返回按钮、操作按钮组与自定义内容。' },
                        { key: 'mobile', label: '移动端', children: '标题栏固定在顶部，向下滚动时收缩为胶囊样式。' }
                      ]}
                    />
                  </Card>
                  <ScrollDemoList />
                </>
              )}
            </Flex>
            {mode === 'footer' ? (
              <Page.Footer>
                <Button>取消</Button>
                <Button type="primary">提交</Button>
              </Page.Footer>
            ) : null}
          </>
        )}
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);
