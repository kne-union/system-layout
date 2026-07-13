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
    id: `CAND${String(index + 1).padStart(4, '0')}`,
    name: `${SURNAMES[index % SURNAMES.length]}${FIRST_NAMES[(index * 3) % FIRST_NAMES.length]}`,
    position: position.title,
    department: position.dept,
    stage: stage.value,
    matchScore: 60 + ((index * 7) % 40),
    experience: 1 + (index % 12),
    location: ['北京', '上海', '深圳', '杭州', '广州', '成都'][index % 6],
    appliedAt: `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    phone: `138${String(index).padStart(8, '0')}`,
    email: `candidate${index + 1}@mail.com`
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
      message.info(`查看候选人：${item}`);
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
    render: value => `${value}%`
  },
  { name: 'experience', title: '经验', width: 90, render: value => `${value} 年` },
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
        { children: '查看', onClick: () => message.info(`查看 ${item.name}`) },
        { children: '安排面试', onClick: () => message.success(`已为 ${item.name} 安排面试`) }
      ];
      if (item.stage !== 'rejected' && item.stage !== 'offer') {
        actions.push({
          children: '淘汰',
          onClick: () => message.warning(`已淘汰 ${item.name}`)
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
            message.info(`正在导出 ${selectedRowKeys.length} 位候选人`);
          }
        },
        {
          key: 'notify',
          label: '批量通知',
          onClick: ({ selectedRowKeys }) => {
            message.success(`已通知 ${selectedRowKeys.length} 位候选人`);
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
