import { useIntl } from 'react-intl';

function TimeAgo({ date }: { date: string }) {
  const intl = useIntl();

  const getTimeAgo = () => {
    const seconds = Math.floor(
      (new Date().getTime() - Date.parse(date)) / 1000
    );

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) +
            intl.formatMessage({
              id: 'TimeAgo.years',
              defaultMessage: ' years ago',
            })
        : intl.formatMessage({
            id: 'TimeAgo.1year',
            defaultMessage: '1 year ago',
          });
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) +
            intl.formatMessage({
              id: 'TimeAgo.months',
              defaultMessage: ' months ago',
            })
        : intl.formatMessage({
            id: 'TimeAgo.1month',
            defaultMessage: '1 month ago',
          });
    }

    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) +
            intl.formatMessage({
              id: 'TimeAgo.days',
              defaultMessage: ' days ago',
            })
        : intl.formatMessage({
            id: 'TimeAgo.1day',
            defaultMessage: '1 day ago',
          });
    }
    interval = seconds / 3600;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) +
            intl.formatMessage({
              id: 'TimeAgo.hours',
              defaultMessage: ' hours ago',
            })
        : intl.formatMessage({
            id: 'TimeAgo.1hour',
            defaultMessage: '1 hour ago',
          });
    }
    interval = seconds / 60;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) +
            intl.formatMessage({
              id: 'TimeAgo.minutes',
              defaultMessage: ' minutes ago',
            })
        : intl.formatMessage({
            id: 'TimeAgo.1minute',
            defaultMessage: '1 minute ago',
          });
    }

    return Math.floor(seconds) > 1
      ? Math.floor(seconds) +
          intl.formatMessage({
            id: 'TimeAgo.seconds',
            defaultMessage: ' seconds ago',
          })
      : intl.formatMessage({
          id: 'TimeAgo.1second',
          defaultMessage: '1 second ago',
        });
  };

  return <>{getTimeAgo()}</>;
}

export default TimeAgo;
