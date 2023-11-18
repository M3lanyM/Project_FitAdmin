
import '@/styles/login.css'
import '@/styles/routine.css'
import '@/styles/exercise.css'
import '@/styles/report.css'
import '@/styles/member.css'
import '@/styles/bill.css'
import '../styles/prueba.scss'
import '@/styles/dashboard.css'
import '@/styles/globals.css'
import '@/styles/client.css'
import ProgressBar from '@/components/ProgressBar'

import type { AppProps } from 'next/app'
function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ProgressBar /> 
      <Component {...pageProps} />
    </>
  );
}

export default App;