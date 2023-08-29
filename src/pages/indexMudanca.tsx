import BaseLayout from '@/components/BaseLayout'
import { Inter } from 'next/font/google'
import ReportPage from '@/pages/indexReport'

const inter = Inter({ subsets: ['latin'] })

export default function IndexMudanca() {
  return (
    <>
      <BaseLayout>
      <ReportPage></ReportPage>
      </BaseLayout>
    </>

  )
}