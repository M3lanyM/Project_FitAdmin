import SidebarProvider from '@/components/SidebarContext'
import Sidebar from '@/components/Sidebar'
import '@/styles/globals.css'
import '@/styles/sidebar.css'
import '@/styles/login.css' 
import '@/styles/routine.css'
import '@/styles/exercise.css'
import '@/styles/report.css'
import '@/styles/member.css'
import '@/styles/client.css'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <Component {...pageProps} />
    </SidebarProvider>
  );
}
