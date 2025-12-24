const { default: SystemLayout, Page } = _SystemLayout;
const { useRef, useState, useEffect } = React;
const BaseExample = () => {
  const ref = useRef(null);
  const [toolbarTarget, setToolbarTarget] = useState(null);
  useEffect(() => {
    setToolbarTarget(ref.current);
  }, []);
  return (
    <div className="mobile-layout">
      {toolbarTarget && (
        <SystemLayout
          isMobile
          toolbarTarget={toolbarTarget}
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
                toolbar: true,
                icon: ({ active }) => (active ? 'home' : 'home_line')
              },
              {
                group: 'HIRING',
                path: '/hiring',
                label: 'Hiring Hub',
                toolbar: true,
                icon: 'icon-assignment_ind'
              },
              {
                group: 'HIRING',
                path: '/hiring/application',
                label: 'Application List',
                toolbar: true,
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
                toolbar: true,
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
              showLength: 1,
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
      )}
      <div ref={ref} />
    </div>
  );
};

render(<BaseExample />);
