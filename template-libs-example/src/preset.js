import React from 'react';
import { preset as fetchPreset } from '@kne/react-fetch';
import { Spin, Empty, message } from 'antd';
import createAjax from '@kne/axios-fetch';
import { preset as remoteLoaderPreset } from '@kne/remote-loader';
import { createTenantMockApis } from './mock/tenantApis';

window.PUBLIC_URL = process.env.PUBLIC_URL;

const registry = {
  url: 'https://uc.fatalent.cn',
  tpl: '{{url}}/packages/@kne-components/{{remote}}/{{version}}/build'
};

export const globalInit = async () => {
  const ajax = createAjax({
    errorHandler: error => message.error(error)
  });

  const componentsCoreRemote = {
    ...registry,
    remote: 'components-core',
    defaultVersion: '0.5.13'
  };

  remoteLoaderPreset({
    remotes: {
      default: componentsCoreRemote,
      'components-core': componentsCoreRemote,
      'components-iconfont': {
        ...registry,
        remote: 'components-iconfont',
        defaultVersion: '0.2.1'
      },
      'components-admin': {
        ...registry,
        remote: 'components-admin',
        defaultVersion: '1.1.60'
      },
      'system-layout':
        process.env.NODE_ENV === 'development'
          ? {
              remote: 'system-layout',
              url: '/',
              tpl: '{{url}}'
            }
          : {
              ...registry,
              remote: 'system-layout',
              defaultVersion: process.env.DEFAULT_VERSION
            }
    }
  });

  fetchPreset({
    ajax,
    loading: (
      <Spin
        delay={500}
        style={{
          position: 'absolute',
          left: '50%',
          padding: '10px',
          transform: 'translateX(-50%)'
        }}
      />
    ),
    error: null,
    empty: <Empty />,
    transformResponse: response => {
      const { data } = response;
      response.data = {
        code: data.code === 0 ? 200 : data.code,
        msg: data.msg,
        results: data.data
      };
      return response;
    }
  });

  return {
    ajax,
    enums: {},
    apis: createTenantMockApis(),
    themeToken: {
      colorPrimary: '#4183F0'
    }
  };
};
