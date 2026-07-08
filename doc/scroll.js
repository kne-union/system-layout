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
        name: `${SURNAMES[i % SURNAMES.length]}${FIRST_NAMES[(i * 3) % FIRST_NAMES.length]}`,
        position: position.title,
        department: position.dept,
        stage: stageInfo.value,
        matchScore: 60 + ((i * 7) % 40),
        experience: 1 + (i % 12),
        location: ['北京', '上海', '深圳', '杭州', '广州', '成都'][i % 6],
        appliedAt: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
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
          format={percent => `${percent}`}
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
          format={percent => `${percent}`}
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
