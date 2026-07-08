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
