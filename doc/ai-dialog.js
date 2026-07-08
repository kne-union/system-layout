const { default: SystemLayout, Page } = _SystemLayout;
const { useState, useRef, useEffect } = React;
const { Flex, Card, Input, Button, Avatar, Tag, Typography, Alert, Spin } = antd;
const { Text, Paragraph } = Typography;

// 模拟招聘助手的知识库应答：根据关键字返回贴近业务的回复
const answerByKeyword = question => {
  const text = question.toLowerCase();
  if (text.includes('简历') || text.includes('筛选')) {
    return '已为「高级前端工程师」筛选出 3 位高匹配候选人：\n1. 王伟 · 6 年经验 · React/TypeScript · 匹配度 92%\n2. 李静 · 5 年经验 · Vue/Node.js · 匹配度 87%\n3. 张磊 · 4 年经验 · React/微前端 · 匹配度 85%\n是否需要我自动发送面试邀约？';
  }
  if (text.includes('面试') || text.includes('安排') || text.includes('邀约')) {
    return '我可以协助安排面试。候选人王伟本周可预约的时间为：\n· 周三 14:00-15:00\n· 周四 10:00-11:00\n面试官张总监周三下午有空，建议约在周三 14:00，是否确认发送日程邀请？';
  }
  if (text.includes('jd') || text.includes('职位') || text.includes('描述')) {
    return '已根据「产品部-高级产品经理」生成 JD 草稿：\n【岗位职责】负责 B 端产品全生命周期管理，主导需求调研与方案设计；\n【任职要求】5 年以上 B 端产品经验，熟悉 SaaS 业务，具备良好的数据分析能力。\n需要我一键同步到招聘渠道吗？';
  }
  if (text.includes('offer') || text.includes('薪资')) {
    return '根据候选人当前薪资（月薪 28K）与我司薪酬带宽，建议 Offer 方案：\n· 月薪 32K × 15 薪\n· 签字费 20K\n该方案在同级别薪酬 P60 分位，具备竞争力。是否生成 Offer 审批单？';
  }
  return '我是招聘助手小 K，可以帮你筛选简历、安排面试、生成 JD、评估 Offer。你可以试着问我「帮我筛选前端简历」或「安排王伟的面试」。';
};

// 快捷提问，模拟真实招聘场景中的高频操作
const QUICK_PROMPTS = ['帮我筛选高级前端工程师的简历', '安排候选人王伟的面试', '生成产品经理的 JD', '评估王伟的 Offer 薪资'];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: '你好，我是招聘助手小 K 👋\n本周你有 3 个职位在招、8 份简历待筛选。需要我帮你做点什么吗？'
    }
  ]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const el = listRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, loading]);

  const send = question => {
    const content = (question ?? value).trim();
    if (!content || loading) {
      return;
    }
    setMessages(prev => [...prev, { role: 'user', content }]);
    setValue('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: answerByKeyword(content) }]);
      setLoading(false);
    }, 800);
  };

  return (
    <Flex vertical style={{ height: '100%' }}>
      <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 16px' }}>
        <Flex vertical gap={16}>
          {messages.map((msg, index) => (
            <Flex key={index} gap={8} align="flex-start" justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}>
              {msg.role === 'ai' && <Avatar style={{ background: '#1677ff', flex: '0 0 auto' }}>K</Avatar>}
              <div
                style={{
                  maxWidth: '80%',
                  padding: '8px 12px',
                  borderRadius: 10,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  background: msg.role === 'user' ? '#1677ff' : 'rgba(255,255,255,0.9)',
                  color: msg.role === 'user' ? '#fff' : 'inherit'
                }}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && <Avatar style={{ background: '#52c41a', flex: '0 0 auto' }}>我</Avatar>}
            </Flex>
          ))}
          {loading && (
            <Flex gap={8} align="center">
              <Avatar style={{ background: '#1677ff', flex: '0 0 auto' }}>K</Avatar>
              <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.9)' }}>
                <Spin size="small" /> <Text type="secondary">小 K 正在思考…</Text>
              </div>
            </Flex>
          )}
        </Flex>
      </div>

      <Flex vertical gap={10} style={{ flex: '0 0 auto', padding: '8px 16px 12px' }}>
        <Flex wrap="wrap" gap={8}>
          {QUICK_PROMPTS.map(prompt => (
            <Tag
              key={prompt}
              color="blue"
              style={{ cursor: 'pointer', margin: 0, padding: '2px 10px', borderRadius: 12 }}
              onClick={() => send(prompt)}
            >
              {prompt}
            </Tag>
          ))}
        </Flex>

        <Flex gap={8}>
          <Input.TextArea
            value={value}
            onChange={e => setValue(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 3 }}
            placeholder="输入你的问题，回车发送…"
            onPressEnter={e => {
              e.preventDefault();
              send();
            }}
          />
          <Button type="primary" loading={loading} onClick={() => send()}>
            发送
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

const menu = {
  base: '/SystemLayout',
  items: [
    { path: '/', label: 'Onboarding', toolbar: true, icon: ({ active }) => (active ? 'home' : 'home_line') },
    { group: 'HIRING', path: '/hiring', label: 'Hiring Hub', toolbar: true, icon: 'icon-assignment_ind' },
    { group: 'HIRING', path: '/hiring/application', label: 'Application List', icon: 'icon-assignment' },
    { group: 'PEOPLE', path: '/people', label: 'Management', toolbar: true, icon: 'icon-automation' }
  ]
};

const BaseExample = () => {
  return (
    <SystemLayout
      userInfo={{ name: 'Lucy L', email: 'lucy@company.com' }}
      menu={menu}
      aiDialog={{
        title: '招聘助手 · 小 K',
        content: <AIAssistant />
      }}
    >
      <Page title="AI 招聘助手">
        <Flex vertical gap={16}>
          <Alert
            type="info"
            showIcon
            message="如何唤起招聘助手"
            description={
              <span>
                <b>桌面端</b>：点击左侧菜单<b>底部的 AI 入口图标</b>，对话框支持两种形态：
                <br />· <b>小窗口（small）</b>：悬浮在左下角，不遮挡主内容；
                <br />· <b>内嵌面板（inner）</b>：点击小窗口右上角的展开图标，助手会嵌入到页面左侧，与内容并排展示。
                <br />
                <b>移动端</b>：点击右下角<b>可拖动的悬浮按钮</b>（可自由拖拽调整位置），以全屏形式展示对话框。
              </span>
            }
          />
          <Card title="招聘助手能做什么" styles={{ body: { padding: 20 } }} style={{ background: 'rgba(255,255,255,0.5)' }}>
            <Flex vertical gap={12}>
              <Paragraph style={{ margin: 0 }}>
                招聘助手小 K 内置在布局中，可在任意页面随时调用，帮助 HR 高效处理日常招聘工作：
              </Paragraph>
              <Flex vertical gap={8}>
                <Text>· 智能筛选简历，按岗位匹配度排序推荐候选人</Text>
                <Text>· 协调面试官与候选人的空闲时间，一键发送日程邀约</Text>
                <Text>· 根据部门和职级自动生成岗位 JD 草稿</Text>
                <Text>· 结合薪酬带宽评估 Offer 方案，生成审批单</Text>
              </Flex>
              <Text type="secondary">提示：在对话框中试着输入「帮我筛选前端简历」或点击快捷提问标签。</Text>
            </Flex>
          </Card>
        </Flex>
      </Page>
    </SystemLayout>
  );
};

render(<BaseExample />);
