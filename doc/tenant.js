const { default: SystemLayout, Page } = _SystemLayout;
const { createWithRemoteLoader } = remoteLoader;
const { Routes, Route, Navigate, useLocation } = reactRouterDom;
const { UserSwitchOutlined, LogoutOutlined, PartitionOutlined, UserOutlined, SafetyCertificateOutlined, HomeOutlined } = icons;
const { message } = antd;

/**
 * 参考 telent-coach/src/components/Tenant：
 * Authenticate 拉取租户用户信息 → SystemLayout 承载菜单 → Setting.* 用 Page 渲染设置页
 * 接口走 example/src/preset.js 中注册的 mock apis.tenant.*
 *
 * menu.base 取当前示例路由前缀（/:id/*），避免跳到 /SystemLayout 后丢失示例页
 */
const TenantDemoInner = createWithRemoteLoader({
  modules: [
    'components-admin:Tenant@Authenticate',
    'components-admin:Tenant@Setting',
    'components-core:Permissions',
    'components-core:Global@SetGlobal'
  ]
})(({ remoteModules, base }) => {
  const [Authenticate, Setting, Permissions, SetGlobal] = remoteModules;

  return (
    <Authenticate>
      {({ global }) => {
        const { tenantUserInfo, tenant } = global;
        return (
          <SetGlobal globalKey="tenant" value={tenant}>
            <SetGlobal globalKey="userInfo" value={{ tenantUserInfo, tenant }}>
              <Permissions request={['tenant']} type="error">
                <SystemLayout
                  logo={{ id: tenant?.logo, src: tenant?.logo }}
                  userInfo={tenantUserInfo}
                  background="linear-gradient(180deg, #E8DCDF, #E1D1E3, #DED7EF, #D5E0F1)"
                  menu={{
                    base,
                    items: [
                      {
                        path: '/',
                        label: '工作台',
                        toolbar: true,
                        icon: <HomeOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '公司信息',
                        path: '/setting/company',
                        icon: { type: 'gongsi' }
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '组织架构',
                        path: '/setting/org',
                        icon: <PartitionOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '用户管理',
                        path: '/setting/user',
                        toolbar: true,
                        icon: <UserOutlined />
                      },
                      {
                        group: 'tenantSetting',
                        groupLabel: '系统设置',
                        label: '权限管理',
                        path: '/setting/permission',
                        icon: <SafetyCertificateOutlined />
                      },
                      {
                        group: 'account',
                        groupLabel: '账号',
                        label: '切换租户',
                        icon: <UserSwitchOutlined />,
                        onClick: () => message.info('示例环境：切换租户（mock）')
                      },
                      {
                        group: 'account',
                        groupLabel: '账号',
                        label: '退出登录',
                        icon: <LogoutOutlined />,
                        onClick: () => message.info('示例环境：退出登录（mock）')
                      }
                    ]
                  }}
                >
                  <Routes>
                    <Route
                      path={base}
                      element={
                        <Page title="工作台">
                          <div style={{ padding: 16, color: '#666', lineHeight: 1.8 }}>
                            <p>
                              当前租户：<strong>{tenant?.name}</strong>
                            </p>
                            <p>
                              当前用户：<strong>{tenantUserInfo?.name}</strong>（{tenantUserInfo?.email}）
                            </p>
                            <p>
                              左侧菜单进入「系统设置」可体验 components-admin:Tenant@Setting 的公司 / 组织 / 用户 / 权限页面，接口均走
                              mock 数据。
                            </p>
                          </div>
                        </Page>
                      }
                    />
                    <Route
                      path={`${base}/setting/company`}
                      element={<Setting.Company>{({ title, children }) => <Page title={title}>{children}</Page>}</Setting.Company>}
                    />
                    <Route
                      path={`${base}/setting/org`}
                      element={
                        <Setting.Org baseUrl={`${base}/setting`}>
                          {({ title, children }) => <Page title={title}>{children}</Page>}
                        </Setting.Org>
                      }
                    />
                    <Route
                      path={`${base}/setting/user`}
                      element={
                        <Setting.User>
                          {({ title, titleExtra, children }) => (
                            <Page title={title} extra={titleExtra}>
                              {children}
                            </Page>
                          )}
                        </Setting.User>
                      }
                    />
                    <Route
                      path={`${base}/setting/permission`}
                      element={
                        <Setting.Permission>
                          {({ title, titleExtra, children }) => (
                            <Page title={title} extra={titleExtra}>
                              {children}
                            </Page>
                          )}
                        </Setting.Permission>
                      }
                    />
                    <Route path="*" element={<Navigate to={base} replace />} />
                  </Routes>
                </SystemLayout>
              </Permissions>
            </SetGlobal>
          </SetGlobal>
        );
      }}
    </Authenticate>
  );
});

const BaseExample = () => {
  const { pathname } = useLocation();
  // /:exampleId/... → 取第一段作为示例 base，保证菜单导航仍落在当前示例 :id/* 下
  const base = '/' + (pathname.replace(/^\//, '').split('/')[0] || 'Tenant 租户设置');
  return <TenantDemoInner base={base} />;
};

render(<BaseExample />);
