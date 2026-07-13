const collectOrgSubtreeIds = (orgs, rootId) => {
  const ids = new Set([String(rootId)]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const org of orgs) {
      const id = String(org.id);
      const parentId = org.parentId != null && org.parentId !== '' ? String(org.parentId) : null;
      if (parentId && ids.has(parentId) && !ids.has(id)) {
        ids.add(id);
        changed = true;
      }
    }
  }
  return [...ids];
};

const normalizeTenantUserStatusFilter = status => {
  const s = status != null ? String(status).trim() : '';
  if (s === 'active') return 'open';
  if (s === 'inactive') return 'closed';
  if (s === 'open' || s === 'closed') return s;
  return '';
};

const loadTenantData = () => import('./tenant-data.json').then(({ default: data }) => data);

const loadFilteredTenantUserList = ({ params } = {}) =>
  loadTenantData().then(data => {
    const filter = params?.filter || {};
    let pageData = data.userList?.pageData || [];
    if (filter.tenantOrgId) {
      const orgIds = collectOrgSubtreeIds(data.orgList || [], filter.tenantOrgId);
      pageData = pageData.filter(item => {
        const ids = new Set();
        if (Array.isArray(item.tenantOrgIds)) {
          item.tenantOrgIds.forEach(id => ids.add(String(id)));
        }
        if (item.tenantOrg?.id) {
          ids.add(String(item.tenantOrg.id));
        }
        return [...ids].some(id => orgIds.includes(id));
      });
    }
    const statusFilter = normalizeTenantUserStatusFilter(filter.status);
    if (statusFilter) {
      pageData = pageData.filter(item => item.status === statusFilter);
    }
    if (filter.keyword) {
      const keyword = String(filter.keyword).toLowerCase();
      pageData = pageData.filter(item =>
        [item.name, item.email, item.phone].filter(Boolean).join(' ').toLowerCase().includes(keyword)
      );
    }
    const totalCount = pageData.length;
    const perPage = Number(params?.perPage) || pageData.length || 20;
    const currentPage = Number(params?.currentPage) || 1;
    const start = (currentPage - 1) * perPage;
    return { pageData: pageData.slice(start, start + perPage), totalCount };
  });

const loadFilteredRoleList = ({ params } = {}) =>
  loadTenantData().then(data => {
    const filter = params?.filter || {};
    let pageData = data.roleList?.pageData || [];
    if (filter.type) {
      pageData = pageData.filter(item => item.type === filter.type);
    }
    if (filter.keyword) {
      const keyword = String(filter.keyword).toLowerCase();
      pageData = pageData.filter(
        item => [item.name, item.code, item.description].filter(Boolean).join(' ').toLowerCase().indexOf(keyword) >= 0
      );
    }
    if (filter.status) {
      pageData = pageData.filter(item => item.status === filter.status);
    }
    return { pageData, totalCount: pageData.length };
  });

const orgLinkConfigMock = () => ({
  enabled: false,
  syncSupported: true,
  sourceOptions: [
    { value: 'wecom', label: '企业微信' },
    { value: 'dingtalk', label: '钉钉' }
  ]
});

/** components-admin:Tenant 所需 mock apis（参考 components-admin mockPreset） */
export const createTenantMockApis = () => ({
  tenant: {
    availableList: {
      loader: () => loadTenantData().then(data => data.availableTenantList)
    },
    switchDefaultTenant: {
      loader: () => ({ code: 0 })
    },
    getUserInfo: {
      loader: () =>
        loadTenantData().then(data => ({
          tenantUserInfo: data.tenantUserInfo,
          company: data.company,
          tenant: data.tenantList.pageData[0],
          userInfo: data.tenantUserInfo
        }))
    },
    companyDetail: {
      loader: () => loadTenantData().then(data => data.company)
    },
    companySave: {
      loader: () => ({ code: 0 })
    },
    orgList: {
      loader: () => loadTenantData().then(data => data.orgList)
    },
    orgCreate: {
      loader: () => ({ id: `dept-${Date.now()}` })
    },
    orgSave: {
      loader: () => ({ code: 0 })
    },
    orgRemove: {
      loader: () => ({ code: 0 })
    },
    orgBatchImport: {
      loader: () => ({
        code: 0,
        data: { createdOrgs: 2, createdUsers: 1, reusedUsers: 0, rowCount: 2 }
      })
    },
    orgLinkConfig: {
      loader: orgLinkConfigMock
    },
    orgLinkSave: {
      loader: () => ({ code: 0 })
    },
    orgLinkCancel: {
      loader: () => ({ code: 0 })
    },
    orgLinkSync: {
      loader: () => ({ code: 0 })
    },
    userList: {
      loader: loadFilteredTenantUserList
    },
    userCreate: {
      loader: () => ({ id: `user-${Date.now()}` })
    },
    userSave: {
      loader: () => ({ code: 0 })
    },
    userRemove: {
      loader: () => ({ code: 0 })
    },
    userSetStatus: {
      loader: () => ({ code: 0 })
    },
    userInviteToken: {
      loader: () => ({ token: `invite_${Date.now()}` })
    },
    userInviteMessage: {
      loader: () => ({ code: 0 })
    },
    sendOrgMessage: {
      loader: () => ({ code: 0 })
    },
    role: {
      list: {
        loader: loadFilteredRoleList
      },
      create: {
        loader: () => ({ id: `role-${Date.now()}` })
      },
      save: {
        loader: () => ({ code: 0 })
      },
      setStatus: {
        loader: () => ({ code: 0 })
      },
      remove: {
        loader: () => ({ code: 0 })
      },
      permissionList: {
        loader: () => loadTenantData().then(data => data.permissionList)
      },
      permissionSave: {
        loader: () => ({ code: 0 })
      }
    },
    sharedGroup: {
      list: {
        loader: () => loadTenantData().then(data => data.sharedGroupList)
      },
      create: {
        loader: () => ({ id: `sg-${Date.now()}` })
      },
      save: {
        loader: () => ({ code: 0 })
      },
      setStatus: {
        loader: () => ({ code: 0 })
      },
      remove: {
        loader: () => ({ code: 0 })
      }
    },
    permission: {
      list: {
        loader: () => loadTenantData().then(data => data.permissionList)
      }
    }
  },
  file: {
    getUrl: {
      loader: ({ params }) => (params?.id ? params.id : 'https://picsum.photos/200/200')
    }
  }
});

export default createTenantMockApis;
