import { createWithIntlProvider } from '@kne/react-intl';
import zhCn from './locale/zh-CN';
import enUS from './locale/en-US';

const withLocale = createWithIntlProvider({
  defaultLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS
  },
  namespace: 'system-layout'
});

export default withLocale;
