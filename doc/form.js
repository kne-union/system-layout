const { default: SystemLayout, Page, BarChartIcon, Card, CARD_THEME, useIsMobile } = _SystemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { App, Flex } = antd;

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: <BarChartIcon /> }
  ]
};

const DEPARTMENT_OPTIONS = [
  { label: '产品部', value: 'product' },
  { label: '研发部', value: 'rd' },
  { label: '设计部', value: 'design' },
  { label: '人力资源部', value: 'hr' }
];

const PROBATION_OPTIONS = [
  { label: '无试用期', value: '0' },
  { label: '1 个月', value: '1' },
  { label: '3 个月', value: '3' },
  { label: '6 个月', value: '6' }
];

const OnboardingForm = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules }) => {
  const [FormInfo, formModule] = remoteModules;
  const { Form, SubmitButton, CancelButton } = formModule;
  const { Input, Select, DatePicker, RadioGroup, Switch, TextArea } = FormInfo.fields;
  const { message } = App.useApp();
  const column = useIsMobile() ? 1 : 2;

  return (
    <Form
      data={{ probation: '3', remote: false }}
      onSubmit={data => {
        message.success(`已提交 ${data.name} 的入职信息`);
      }}
    >
      <Page title="新员工入职" back>
        <Flex vertical gap={16}>
          <Card theme={CARD_THEME.tint} title="填写入职信息" description="带 * 为必填项。手机预览下，底部操作栏与导航合并为同一行，可通过左右圆钮切换。" />
          <FormInfo
            title="基本信息"
            column={column}
            list={[
              <Input name="name" label="姓名" rule="REQ LEN-2-20" />,
              <Input name="phone" label="手机号" rule="REQ PHONE" />,
              <Input name="email" label="邮箱" rule="REQ EMAIL" />,
              <RadioGroup
                name="gender"
                label="性别"
                options={[
                  { label: '男', value: 'male' },
                  { label: '女', value: 'female' }
                ]}
              />
            ]}
          />
          <FormInfo
            title="岗位信息"
            column={column}
            list={[
              <Select name="department" label="部门" rule="REQ" options={DEPARTMENT_OPTIONS} />,
              <Input name="position" label="职位" rule="REQ" />,
              <DatePicker name="joinDate" label="入职日期" rule="REQ" />,
              <Select name="probation" label="试用期" options={PROBATION_OPTIONS} />,
              <Switch name="remote" label="远程办公" />
            ]}
          />
          <FormInfo title="补充说明" column={1} list={[<TextArea name="remark" label="备注" />]} />
        </Flex>
        <Page.Footer>
          <CancelButton>重置</CancelButton>
          <SubmitButton type="primary">提交</SubmitButton>
        </Page.Footer>
      </Page>
    </Form>
  );
});

const BaseExample = () => (
  <SystemLayout userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }} menu={menu}>
    <OnboardingForm />
  </SystemLayout>
);

render(<BaseExample />);
