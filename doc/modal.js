const { default: SystemLayout, Page, BarChartIcon, Card, CARD_THEME } = _SystemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { App, Flex, Button, Descriptions, Tag, Typography } = antd;

const { Paragraph } = Typography;

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: <BarChartIcon /> }
  ]
};

const CandidateDetail = () => (
  <Descriptions column={1} size="small" bordered>
    <Descriptions.Item label="姓名">李雨桐</Descriptions.Item>
    <Descriptions.Item label="岗位">前端工程师 · 4 年</Descriptions.Item>
    <Descriptions.Item label="来源">内推 · 张三</Descriptions.Item>
    <Descriptions.Item label="状态">
      <Tag color="processing">简历通过</Tag>
    </Descriptions.Item>
  </Descriptions>
);

const ModalDemo = createWithRemoteLoader({
  modules: ['components-core:Modal@useModal', 'components-core:Modal@useConfirmModal', 'components-core:Modal@ModalContextHolder']
})(({ remoteModules }) => {
  const [useModal, useConfirmModal, ModalContextHolder] = remoteModules;
  const modal = useModal();
  const confirmModal = useConfirmModal();
  const { message } = App.useApp();

  const openDetail = size => {
    modal({
      title: '候选人快览',
      size,
      confirmText: '加入待评估',
      children: (
        <Flex vertical gap={12}>
          <CandidateDetail />
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            命令式弹窗适用于列表页「快速查看」，确认后关闭并提示。
          </Paragraph>
        </Flex>
      ),
      onConfirm: () => {
        message.success('已加入待评估队列');
      }
    });
  };

  return (
    <Page title="弹窗">
      <ModalContextHolder />
      <Flex vertical gap={16}>
        <Card theme={CARD_THEME.tint} title="components-core:Modal" description="useModal 打开内容弹窗（small / default / large，移动端全屏），需挂载 ModalContextHolder；useConfirmModal 打开确认与提示框。" />
        <Card title="内容弹窗">
          <Flex gap={8} wrap>
            <Button onClick={() => openDetail('small')}>small</Button>
            <Button type="primary" onClick={() => openDetail('default')}>
              default
            </Button>
            <Button onClick={() => openDetail('large')}>large</Button>
          </Flex>
        </Card>
        <Card title="确认框">
          <Flex gap={8} wrap>
            <Button
              danger
              onClick={() =>
                confirmModal({
                  danger: true,
                  type: 'confirm',
                  title: '确定要淘汰该候选人吗？',
                  message: '淘汰后候选人将移出当前流程，可在人才库中重新激活。',
                  onConfirm: () => message.success('已淘汰')
                })
              }
            >
              危险确认
            </Button>
            <Button
              onClick={() =>
                confirmModal({
                  type: 'info',
                  title: '操作提示',
                  message: '面试安排已同步到候选人日历，系统将在面试前一小时发送提醒。'
                })
              }
            >
              信息提示
            </Button>
          </Flex>
        </Card>
      </Flex>
    </Page>
  );
});

const BaseExample = () => (
  <SystemLayout userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }} menu={menu}>
    <ModalDemo />
  </SystemLayout>
);

render(<BaseExample />);
