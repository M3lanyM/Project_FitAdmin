import { useRouter } from 'next/router';
import LinearProgress from '@mui/material/LinearProgress';
import React from 'react';

const ProgressBar = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  return loading ? <LinearProgress className="custom-progress-bar"/> : null;
};

export default ProgressBar;
