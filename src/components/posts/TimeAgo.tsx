function TimeAgo({ date }: { date: string }) {
  const getTimeAgo = () => {
    const seconds = Math.floor(
      (new Date().getTime() - Date.parse(date)) / 1000
    );

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + ' years ago'
        : '1 year ago';
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + ' months ago'
        : '1 month ago';
    }

    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + ' days ago'
        : '1 day ago';
    }
    interval = seconds / 3600;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + ' hours ago'
        : '1 hour ago';
    }
    interval = seconds / 60;

    if (interval > 1) {
      return Math.floor(interval) > 1
        ? Math.floor(interval) + ' minutes ago'
        : '1 minute ago';
    }

    return Math.floor(seconds) > 1
      ? Math.floor(seconds) + ' seconds ago'
      : '1 second ago';
  };

  return <>{getTimeAgo()}</>;
}

export default TimeAgo;
