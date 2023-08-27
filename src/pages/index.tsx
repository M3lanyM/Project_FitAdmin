import { Inter } from 'next/font/google'
import LoginPage from '@/components/LoginPage'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <body className="bodyLogin">
<LoginPage></LoginPage>
    </body>

</>

  )
}
