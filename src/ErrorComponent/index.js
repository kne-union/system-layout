import React from 'react';
import { Alert, Button } from 'antd';
import ReactErrorBoundary from '@kne/react-error-boundary';
import { useIntl } from '@kne/react-intl';
import withLocale from '../withLocale';

const ErrorComponent = withLocale(() => {
  const { formatMessage } = useIntl();
  return (
    <Alert
      message={formatMessage({ id: 'systemError' })}
      showIcon
      type="error"
      action={
        <Button size="small" danger onClick={() => window.location.reload()}>
          {formatMessage({ id: 'refresh' })}
        </Button>
      }
    />
  );
});

const ErrorBoundary = props => {
  return <ReactErrorBoundary {...props} errorComponent={ErrorComponent} />;
};

export default ErrorBoundary;
