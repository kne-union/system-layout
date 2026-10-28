const { default: SystemLayout, Page, BarChartIcon, Card, CARD_THEME, useIsMobile } = _SystemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { SelectFunction, SelectIndustry, SelectAddress } = _SuperSelectPlus;
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

const SKILL_OPTIONS = ['React', 'Vue', 'Node.js', 'TypeScript', 'Go', 'Java', 'Python', 'Figma', '数据分析', '项目管理'].map(label => ({ label, value: label }));

const ORG_OPTIONS = [
  { value: 'hq', parentId: null, label: '集团总部' },
  { value: 'tech', parentId: 'hq', label: '技术中心' },
  { value: 'tech-fe', parentId: 'tech', label: '前端开发组' },
  { value: 'tech-be', parentId: 'tech', label: '后端开发组' },
  { value: 'tech-qa', parentId: 'tech', label: '质量保障组' },
  { value: 'product', parentId: 'hq', label: '产品中心' },
  { value: 'product-design', parentId: 'product', label: '产品设计组' },
  { value: 'product-pm', parentId: 'product', label: '项目管理组' },
  { value: 'hr', parentId: 'hq', label: '人力资源部' }
];

const USER_OPTIONS = [
  { value: 'u1', label: '王子豪', description: '技术中心 · 前端负责人' },
  { value: 'u2', label: '李思琪', description: '技术中心 · 后端负责人' },
  { value: 'u3', label: '陈雨桐', description: '产品中心 · 产品总监' },
  { value: 'u4', label: '赵一鸣', description: '人力资源部 · HRBP' },
  { value: 'u5', label: '孙嘉怡', description: '产品中心 · 设计主管' }
];

const COURSE_OPTIONS = [
  { value: 'c1', label: '新员工入职引导', category: '通用', duration: '2 课时' },
  { value: 'c2', label: '信息安全与合规', category: '通用', duration: '1 课时' },
  { value: 'c3', label: '前端工程化实践', category: '技术', duration: '6 课时' },
  { value: 'c4', label: '微服务架构入门', category: '技术', duration: '8 课时' },
  { value: 'c5', label: '产品需求分析', category: '产品', duration: '4 课时' }
];

const COURSE_COLUMNS = [
  { name: 'label', title: '课程名称', span: 12 },
  { name: 'category', title: '类别', span: 6 },
  { name: 'duration', title: '课时', span: 6 }
];

// super-select-plus 不在 FormInfo.fields 中，需通过 FormInfo.hooks.useOnChange 接入 Form
const createPlusField = Component =>
  createWithRemoteLoader({
    modules: ['components-core:FormInfo']
  })(({ remoteModules, ...props }) => {
    const [FormInfo] = remoteModules;
    const render = FormInfo.hooks.useOnChange(Object.assign({ placeholder: `请选择${props.label || ''}` }, props));
    return render(Component);
  });

const FunctionField = createPlusField(SelectFunction);
const IndustryField = createPlusField(SelectIndustry);
const AddressField = createPlusField(SelectAddress);

const OnboardingForm = createWithRemoteLoader({
  modules: ['components-core:FormInfo', 'components-core:FormInfo@formModule']
})(({ remoteModules }) => {
  const [FormInfo, formModule] = remoteModules;
  const { Form, SubmitButton, CancelButton } = formModule;
  const { Input, Select, DatePicker, RadioGroup, Switch, TextArea, SuperSelect, SuperSelectTree, SuperSelectUser, SuperSelectTableList } = FormInfo.fields;
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
          <FormInfo
            title="组织与协作（SuperSelect）"
            column={column}
            list={[
              <SuperSelectTree name="org" label="所属组织" rule="REQ" single options={ORG_OPTIONS} />,
              <SuperSelectUser name="leader" label="直属上级" rule="REQ" single options={USER_OPTIONS} />,
              <SuperSelectUser name="mentors" label="入职导师" options={USER_OPTIONS} maxLength={2} />,
              <SuperSelect name="skills" label="技能标签" options={SKILL_OPTIONS} />,
              <SuperSelectTableList name="courses" label="培训课程" options={COURSE_OPTIONS} columns={COURSE_COLUMNS} />
            ]}
          />
          <FormInfo
            title="职业背景（SuperSelectPlus）"
            column={column}
            list={[
              <FunctionField name="function" label="职能" rule="REQ" single />,
              <IndustryField name="industries" label="过往行业" />,
              <AddressField name="city" label="工作城市" rule="REQ" single />
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
