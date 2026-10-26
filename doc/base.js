const { default: SystemLayout, Page, BarChartIcon, NO_CAPSULE_BTN_CLASS, Card, CARD_THEME } = _SystemLayout;
const { Flex, Row, Col, Statistic, Progress, Tag, Typography, Switch, Space, Button, Segmented, Slider } = antd;
const { useState } = React;
const { Text, Title } = Typography;

const STATS = [
  { title: '待办任务', value: 8, suffix: '项', color: '#1677ff' },
  { title: '本月入职', value: 24, suffix: '人', color: '#52c41a' },
  { title: '待面试', value: 15, suffix: '场', color: '#faad14' },
  { title: '离职申请', value: 3, suffix: '份', color: '#ff4d4f' }
];

const DONE_COLOR = '#52c41a';

const ONBOARDING_STEPS = [
  { title: '完善个人资料', desc: '头像、紧急联系人与工资卡信息', date: '10/20', done: true },
  { title: '签署入职文件', desc: '劳动合同与保密协议电子签', date: '10/21', done: true },
  { title: '领取办公设备', desc: '到 IT 服务台领取电脑与工牌', date: '10/28', done: false },
  { title: '参加新人培训', desc: '公司文化与制度培训，周五 14:00', date: '10/31', done: false }
];

const LOGO_OPTIONS = {
  default: undefined,
  empty: null,
  broken: { src: 'https://example.invalid/logo.png' }
};

// 布局留白控制面板：悬浮于 Layout 之外（fixed），实时调节 padding 参数
const PaddingControl = ({ value, onChange }) => (
  <Card theme={CARD_THEME.solid} padding={12} hover={false} style={{ position: 'fixed', top: 16, right: 16, zIndex: 1100, width: 220 }}>
    <Flex vertical gap={4}>
      <Text type="secondary">
        布局留白 padding：<Text strong>{value}px</Text>
      </Text>
      <Slider min={0} max={64} step={4} value={value} onChange={onChange} tooltip={{ formatter: v => `${v}px` }} />
    </Flex>
  </Card>
);

const BaseExample = () => {
  const [toolbarMinimal, setToolbarMinimal] = useState(false);
  const [logoMode, setLogoMode] = useState('default');
  const [layoutPadding, setLayoutPadding] = useState(12);
  const doneCount = ONBOARDING_STEPS.filter(step => step.done).length;
  const percent = Math.round((doneCount / ONBOARDING_STEPS.length) * 100);

  return (
    <>
      <PaddingControl value={layoutPadding} onChange={setLayoutPadding} />
      <SystemLayout
        padding={layoutPadding}
        logo={LOGO_OPTIONS[logoMode]}
      toolbarMinimal={toolbarMinimal}
      userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }}
      menu={{
        base: '/SystemLayout',
        items: [
          { path: '/', label: 'Onboarding', toolbar: true, badge: 8, icon: ({ active }) => (active ? 'home' : 'home_line') },
          { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, badge: true, icon: 'icon-assignment_ind' },
          { group: 'HIRING', path: '/hiring/application', label: 'Application List', icon: 'icon-assignment' },
          { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, badge: { count: 120, overflowCount: 99 }, icon: <BarChartIcon /> },
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
          <Card theme={CARD_THEME.tint}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
              <Flex vertical gap={4}>
                <Title level={4} style={{ margin: 0 }}>
                  下午好，Lucy 👋
                </Title>
                <Text type="secondary">欢迎回到工作台，今天有 8 项待办事项等待处理。</Text>
              </Flex>
              <Space wrap>
                <Text type="secondary">Logo</Text>
                <Segmented
                  size="small"
                  value={logoMode}
                  onChange={setLogoMode}
                  options={[
                    { label: '默认', value: 'default' },
                    { label: '不显示', value: 'empty' },
                    { label: '加载失败', value: 'broken' }
                  ]}
                />
                <Text type="secondary">极简工具栏</Text>
                <Switch checked={toolbarMinimal} onChange={setToolbarMinimal} />
                <Tag color="processing" style={{ fontSize: 13, padding: '4px 12px' }}>
                  入职进度 {percent}%
                </Tag>
              </Space>
            </Flex>
          </Card>

          <Card theme={CARD_THEME.glass} title="按钮圆角">
            <Flex vertical gap={12}>
              <Flex vertical gap={8}>
                <Text type="secondary">Layout 内默认胶囊按钮</Text>
                <Space wrap>
                  <Button type="primary">Primary</Button>
                  <Button>Default</Button>
                  <Button danger>Danger</Button>
                </Space>
              </Flex>
              <Flex vertical gap={8}>
                <Text type="secondary">
                  使用 <code>NO_CAPSULE_BTN_CLASS</code> 取消胶囊圆角
                </Text>
                <div className={NO_CAPSULE_BTN_CLASS}>
                  <Space wrap>
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button danger>Danger</Button>
                  </Space>
                </div>
              </Flex>
            </Flex>
          </Card>

          <Row gutter={[12, 12]}>
            {STATS.map(stat => (
              <Col xs={12} md={6} key={stat.title}>
                <Card theme={CARD_THEME.accent} color={stat.color} padding={16}>
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

          <Card
            theme={CARD_THEME.glass}
            subtitle="新人入职 · Lucy"
            title="入职清单"
            extra={`已完成 ${doneCount}/${ONBOARDING_STEPS.length}`}
          >
            <Progress percent={percent} showInfo={false} size="small" strokeColor="var(--sl-primary)" />
            {ONBOARDING_STEPS.map((step, index) => (
              <Card
                key={step.title}
                theme={CARD_THEME.glass}
                color={step.done ? DONE_COLOR : undefined}
                hover={false}
                padding="12px 16px"
                prefix={step.done ? '✓' : index + 1}
                title={step.title}
                description={step.desc}
                extra={step.done ? `${step.date} 完成` : `${step.date} 截止`}
              />
            ))}
          </Card>
        </Flex>
      </Page>
    </SystemLayout>
    </>
  );
};

render(<BaseExample />);
