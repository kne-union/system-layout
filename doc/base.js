const { default: SystemLayout, Page } = _SystemLayout;

const BaseExample = () => {
  return (
    <div>
      <SystemLayout
        userInfo={{
          name: 'Lucy L',
          email: 'lucy@company.com'
        }}
        aiDialog={{}}
        menu={{
          base: '/SystemLayout',
          items: [
            {
              path: '/',
              label: 'Onboarding',
              icon: ({ active }) => (active ? 'home' : 'home_line')
            },
            {
              group: 'HIRING',
              path: '/hiring',
              label: 'Hiring Hub',
              icon: 'icon-assignment_ind'
            },
            {
              group: 'HIRING',
              path: '/hiring/application',
              label: 'Application List',
              icon: 'icon-assignment'
            },
            {
              group: 'PEOPLE',
              path: '/people',
              label: 'Management',
              icon: 'icon-automation'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review',
              label: 'Projects',
              icon: 'icon-manage_accounts'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review/employee',
              label: 'Employee',
              icon: 'icon-groups_2'
            },
            {
              group: 'TALENT REVIEW',
              path: '/talent-review/ai-models',
              label: 'AI Models',
              icon: 'icon-network_intelligence'
            }
          ]
        }}>
        <Page
          title="Home"
          buttonProps={{
            list: [
              {
                type: 'primary',
                children: 'New'
              },
              {
                children: 'Options'
              },
              {
                loading: true,
                children: 'Options2'
              }
            ]
          }}>
          Content
        </Page>
      </SystemLayout>
    </div>
  );
};

render(<BaseExample />);
