const { default: SystemLayout, Page } = _SystemLayout;
const { useState } = React;
const { Segmented, Button, Flex, Card, Alert, Descriptions, Empty } = antd;

const MODE_OPTIONS = [
  { label: '基础', value: 'basic' },
  { label: '返回', value: 'back' },
  { label: 'Extra', value: 'extra' },
  { label: '无填充', value: 'noPadding' },
  { label: '函数式', value: 'function' },
  { label: '无导航', value: 'noNavbar' },
  { label: '无工具栏', value: 'noToolbar' }
];

const MODE_TIPS = {
  basic: '标准页面：标题栏 + 操作按钮组 + 内容区。',
  back: '已启用返回按钮（back），点击会调用 navigate(-1)。',
  extra: '已自定义 extra 内容，替代默认的按钮组。',
  noPadding: '已移除内容区内边距（noPadding），适合放置全屏地图、表格等。',
  function: '函数式子组件模式：Page 将渲染控制权交给 children 函数。',
  noNavbar: '已隐藏顶部导航栏（navbar=false）。',
  noToolbar: '已隐藏底部工具栏（toolbar=false）。'
};

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

const BaseExample = () => {
  const [mode, setMode] = useState('basic');
  const [loading, setLoading] = useState(false);

  return (
    <SystemLayout userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }} menu={menu}>
      <Page
        title="Page 组件演示"
        back={mode === 'back'}
        extra={mode === 'extra' ? <Button size="small" type="primary">自定义操作</Button> : null}
        noPadding={mode === 'noPadding'}
        navbar={mode !== 'noNavbar'}
        toolbar={mode !== 'noToolbar'}
        buttonProps={{
          showLength: 1,
          list: [
            { type: 'primary', children: 'New' },
            { children: 'Options' },
            { children: 'Export' }
          ]
        }}
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
                  </Flex>
                )
              });
            }
          : (
            <Flex vertical gap={16}>
              <ModeSwitcher mode={mode} setMode={setMode} />
              {mode === 'noPadding' ? (
                <Flex
                  align="center"
                  justify="center"
                  style={{ background: 'rgba(0,0,0,0.04)', height: 300, borderRadius: 8 }}
                >
                  <Empty description="无内边距内容区（noPadding）" />
                </Flex>
              ) : (
                <>
                  <Alert type="info" showIcon message={MODE_TIPS[mode]} />
                  <Card size="small" style={{ background: 'rgba(255,255,255,0.5)' }}>
                    <Descriptions column={1} size="small" items={[
                      { key: 'mode', label: '当前模式', children: mode },
                      { key: 'desc', label: '说明', children: 'Page 提供标题栏、返回按钮、操作按钮组与自定义内容。' },
                      { key: 'mobile', label: '移动端', children: '标题栏固定在顶部，向下滚动时收缩为胶囊样式。' }
                    ]} />
                  </Card>
                </>
              )}
            </Flex>
          )}
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);
