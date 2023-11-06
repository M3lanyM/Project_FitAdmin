import SidebarProvider from '@/pages/Sidebar/SidebarContext'
import '@/styles/globals.css'
import '@/styles/sidebar.css'
import '@/styles/login.css'
import '@/styles/routine.css'
import '@/styles/exercise.css'
import '@/styles/report.css'
import '@/styles/member.css'
import '@/styles/client.css'
import '@/styles/bill.css'
import type { AppProps } from 'next/app'
import ProgressBar from '@/components/ProgressBar'

export default function App({ Component, pageProps }: AppProps) {
  return (

    <SidebarProvider>
            <ProgressBar /> {/* Agregar el ProgressBar aquí */}

      <Component {...pageProps} />
    </SidebarProvider>
  );
}
