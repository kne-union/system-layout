const { default: SystemLayout, Page, useScrollElement, useIsMobile, BarChartIcon, Card, CARD_THEME } = _SystemLayout;
const { default: TablePage, Table } = _TablePage;
const { fields, filterInterceptors } = _ReactFilter;
const {
  InputFilterItem,
  NumberRangeFilterItem,
  DatePickerFilterItem,
  DateRangePickerFilterItem,
  TypeDateRangePickerFilterItem,
  SuperSelectFilterItem,
  SelectTreeFilterItem,
  SelectTableListFilterItem,
  SelectCascaderFilterItem,
  SelectFunctionFilterItem,
  SelectIndustryFilterItem,
  SelectAddressFilterItem
} = fields;
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

// functionCode 取自 @kne/super-select-plus 内置职能数据，供职能筛选按编码前缀匹配
const POSITIONS = [
  { title: '高级前端工程师', dept: '技术部', functionCode: '003006041' },
  { title: '产品经理', dept: '产品部', functionCode: '002002010' },
  { title: 'UI/UX 设计师', dept: '设计部', functionCode: '004013123' },
  { title: '数据分析师', dept: '数据部', functionCode: '003009074' },
  { title: '增长运营专员', dept: '运营部', functionCode: '005020172' }
];

// 城市 / 行业编码同样取自 @kne/super-select-plus 内置数据
const CITIES = [
  { name: '北京', code: '010' },
  { name: '上海', code: '020' },
  { name: '深圳', code: '050090' },
  { name: '杭州', code: '070020' },
  { name: '广州', code: '050020' },
  { name: '成都', code: '280020' }
];

const INDUSTRY_CODES = ['001001', '001003', '004', '015', '001002'];

const ORG_TREE = [
  { id: 'rd-center', parentId: null, name: '研发中心' },
  { id: '技术部', parentId: 'rd-center', name: '技术部' },
  { id: '数据部', parentId: 'rd-center', name: '数据部' },
  { id: 'product-center', parentId: null, name: '产品中心' },
  { id: '产品部', parentId: 'product-center', name: '产品部' },
  { id: '设计部', parentId: 'product-center', name: '设计部' },
  { id: 'ops-center', parentId: null, name: '运营中心' },
  { id: '运营部', parentId: 'ops-center', name: '运营部' }
];

const RECRUITERS = [
  { id: 'hr1', name: '赵一鸣', team: '技术招聘组', phone: '13900000001' },
  { id: 'hr2', name: '孙嘉怡', team: '产品设计招聘组', phone: '13900000002' },
  { id: 'hr3', name: '周子涵', team: '综合招聘组', phone: '13900000003' },
  { id: 'hr4', name: '吴思远', team: '校园招聘组', phone: '13900000004' }
];

const RECRUITER_COLUMNS = [
  { name: 'name', title: '姓名', span: 8 },
  { name: 'team', title: '所属小组', span: 16 }
];

const EDUCATION_TREE = [
  {
    id: 'bachelor',
    name: '本科',
    children: [
      { id: 'bachelor-985', name: '985 院校' },
      { id: 'bachelor-211', name: '211 院校' },
      { id: 'bachelor-normal', name: '普通院校' }
    ]
  },
  {
    id: 'master',
    name: '硕士',
    children: [
      { id: 'master-985', name: '985 院校' },
      { id: 'master-overseas', name: '海外院校' }
    ]
  },
  { id: 'phd', name: '博士' }
];

const EDUCATION_LEAVES = EDUCATION_TREE.flatMap(item =>
  (item.children || [item]).map(child => ({ id: child.id, label: item.children ? `${item.name} · ${child.name}` : item.name }))
);

const FIRST_NAMES = ['伟', '芳', '娜', '秀英', '敏', '静', '强', '磊', '洋', '艳', '勇', '军', '杰', '娟', '涛', '明'];
const SURNAMES = ['王', '李', '张', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '马', '朱', '胡', '林'];

const stageMap = Object.fromEntries(
  STAGES.map(({ value, label, color }) => [value, { type: color === 'default' ? 'default' : color, text: label }])
);

const stageOptions = STAGES.map(({ value, label }) => ({ value, label }));
const departmentOptions = DEPARTMENTS.map(item => ({ value: item, label: item }));

const formatDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const buildCandidate = index => {
  const position = POSITIONS[index % POSITIONS.length];
  const stage = STAGES[index % STAGES.length];
  const city = CITIES[index % CITIES.length];
  const education = EDUCATION_LEAVES[index % EDUCATION_LEAVES.length];
  return {
    id: `CAND${String(index + 1).padStart(4, '0')}`,
    name: `${SURNAMES[index % SURNAMES.length]}${FIRST_NAMES[(index * 3) % FIRST_NAMES.length]}`,
    position: position.title,
    department: position.dept,
    stage: stage.value,
    matchScore: 60 + ((index * 7) % 40),
    experience: 1 + (index % 12),
    location: city.name,
    cityCode: city.code,
    functionCode: position.functionCode,
    industryCode: INDUSTRY_CODES[index % INDUSTRY_CODES.length],
    recruiter: RECRUITERS[index % RECRUITERS.length].id,
    recruiterName: RECRUITERS[index % RECRUITERS.length].name,
    education: education.id,
    educationLabel: education.label,
    lastContactAt: formatDate(new Date(Date.now() - ((index * 5) % 120) * 24 * 3600 * 1000)),
    // 仅第一行用于禁用态验收，排到列表最前便于对照
    appliedAt: index === 0 ? '2024-12-31' : `2024-${String((index % 12) + 1).padStart(2, '0')}-${String((index % 28) + 1).padStart(2, '0')}`,
    phone: `138${String(index).padStart(8, '0')}`,
    email: `candidate${index + 1}@mail.com`,
    opsDisabled: index === 0
  };
};

const normalizeFilterValue = value => {
  if (value == null) {
    return value;
  }
  return Array.isArray(value) ? value[0] : value;
};

const toList = value => (value == null ? [] : Array.isArray(value) ? value : [value]).filter(item => item != null && item !== '');

const filterByRange = (list, key, range) => {
  const [min, max] = toList(range).length ? range : [];
  if (min == null && max == null) {
    return list;
  }
  return list.filter(item => (min == null || item[key] >= min) && (max == null || item[key] <= max));
};

const filterByDateRange = (list, key, range) => {
  if (!Array.isArray(range) || !range[0] || !range[1]) {
    return list;
  }
  const [start, end] = range.map(item => formatDate(new Date(item)));
  return list.filter(item => item[key] >= start && item[key] <= end);
};

const filterByCodePrefix = (list, key, value) => {
  const codes = toList(value);
  if (!codes.length) {
    return list;
  }
  return list.filter(item => codes.some(code => String(item[key]).startsWith(code)));
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

  const departments = toList(params.department);
  if (departments.length) {
    result = result.filter(item => departments.includes(item.department));
  }

  // 选中中心节点时包含其下所有部门
  const orgIds = toList(params.org);
  if (orgIds.length) {
    const deptSet = new Set(orgIds.flatMap(id => [id, ...ORG_TREE.filter(node => node.parentId === id).map(node => node.id)]));
    result = result.filter(item => deptSet.has(item.department));
  }

  const keywordName = normalizeFilterValue(params.name);
  if (keywordName) {
    result = result.filter(item => item.name.includes(keywordName));
  }

  result = filterByRange(result, 'matchScore', params.matchScore);
  result = filterByRange(result, 'experience', params.experience);
  result = filterByDateRange(result, 'appliedAt', params.appliedAt);
  result = filterByDateRange(result, 'lastContactAt', params.lastContactAt?.value);

  if (params.appliedMonth) {
    const month = formatDate(new Date(params.appliedMonth)).slice(0, 7);
    result = result.filter(item => item.appliedAt.startsWith(month));
  }

  const recruiters = toList(params.recruiter);
  if (recruiters.length) {
    result = result.filter(item => recruiters.includes(item.recruiter));
  }

  // 编码类筛选按前缀匹配，选父级节点也能命中子级
  result = filterByCodePrefix(result, 'education', params.education);
  result = filterByCodePrefix(result, 'cityCode', params.city);
  result = filterByCodePrefix(result, 'functionCode', params.function);
  result = filterByCodePrefix(result, 'industryCode', params.industry);

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
  { name: 'educationLabel', title: '学历', width: 140 },
  { name: 'recruiterName', title: '招聘负责人', width: 110 },
  { name: 'appliedAt', title: '投递日期', width: 120, format: 'date', sort: true },
  { name: 'lastContactAt', title: '最近沟通', width: 120, format: 'date' },
  { name: 'phone', title: '手机号', width: 140, render: value => value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') },
  { name: 'email', title: '邮箱', width: 200, ellipsis: true, hidden: true },
  {
    name: 'options',
    title: '操作',
    renderType: 'options',
    fixed: 'right',
    width: 200,
    min: 160,
    max: 260,
    getValueOf: item => {
      // 仅禁用一行，便于对比验收 link 禁用无灰底
      const locked = !!item.opsDisabled;
      return [
        {
          children: '查看',
          disabled: locked,
          onClick: () => message.info(`查看 ${item.name}`)
        },
        {
          children: '安排面试',
          disabled: locked,
          onClick: () => message.success(`已为 ${item.name} 安排面试`)
        },
        {
          children: '淘汰',
          disabled: locked,
          onClick: () => message.warning(`已淘汰 ${item.name}`)
        }
      ];
    }
  }
];

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'HIRING', path: '/hiring/application', label: 'Application List', toolbar: true, icon: 'icon-assignment' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: <BarChartIcon /> }
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
      scroll={{ x: 1800 }}
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
              props: { name: 'department', label: '部门', allowSelectedAll: true, options: departmentOptions }
            },
            {
              type: SelectTreeFilterItem,
              props: {
                name: 'org',
                label: '组织架构',
                options: ORG_TREE,
                valueKey: 'id',
                labelKey: 'name',
                interceptor: filterInterceptors.multi
              }
            },
            { type: SelectAddressFilterItem, props: { name: 'city', label: '城市' } },
            { type: NumberRangeFilterItem, props: { name: 'matchScore', label: '匹配度', unit: '%', min: 0, max: 100 } }
          ],
          [
            { type: InputFilterItem, props: { name: 'name', label: '姓名' } },
            { type: DateRangePickerFilterItem, props: { name: 'appliedAt', label: '投递日期' } },
            { type: DatePickerFilterItem, props: { name: 'appliedMonth', label: '投递月份', picker: 'month' } },
            { type: TypeDateRangePickerFilterItem, props: { name: 'lastContactAt', label: '最近沟通' } }
          ],
          [
            {
              type: SelectTableListFilterItem,
              props: {
                name: 'recruiter',
                label: '招聘负责人',
                options: RECRUITERS,
                columns: RECRUITER_COLUMNS,
                valueKey: 'id',
                labelKey: 'name',
                interceptor: filterInterceptors.multi
              }
            },
            {
              type: SelectCascaderFilterItem,
              props: {
                name: 'education',
                label: '学历',
                options: EDUCATION_TREE,
                valueKey: 'id',
                labelKey: 'name',
                interceptor: filterInterceptors.multi
              }
            },
            { type: SelectFunctionFilterItem, props: { name: 'function', label: '职能', interceptor: filterInterceptors.multi } },
            { type: SelectIndustryFilterItem, props: { name: 'industry', label: '行业', interceptor: filterInterceptors.multi } },
            { type: NumberRangeFilterItem, props: { name: 'experience', label: '工作年限', unit: '年', min: 0 } }
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
          <Card
            theme={CARD_THEME.tint}
            title={
              <Flex gap={8} wrap="wrap" align="center">
                <Tag color="blue" style={{ margin: 0 }}>Layout 滚动</Tag>
                <Tag color="orange" style={{ margin: 0 }}>禁用操作</Tag>
              </Flex>
            }
            description={
              <>
                通过 <code>useScrollElement</code> 绑定 Layout 滚动容器；使用 TablePage 自带的 <code>tab</code> / <code>filter</code> /{' '}
                <code>search</code> 与分页。filter 覆盖输入、数字区间、日期 / 日期范围 / 类型日期范围、SuperSelect 列表 / 树 / 表格 / 级联，以及职能 / 行业 / 城市业务选择器，点「更多」查看全部。首页第一行操作禁用（其余正常），用于对比验收 link 禁用无灰底
              </>
            }
          />
          <CandidateTable />
        </Flex>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);
