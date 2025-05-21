import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import NavbarComponent from './components/NavbarComponent'
import classNames from 'classnames'
import FooterComponent from './components/ui/FooterComponent'
import { Toaster } from 'sonner'
import CaptchaWrapperComponent from './components/captcha/CaptchaWrapperComponent'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sistema de divulgación de ICPC',
  description: 'Plataforma para la divulgación de información y recursos del ICPC'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={classNames(montserrat.className, 'bg-white dark:bg-dark-secondary ')}>
        <NavbarComponent />
        <CaptchaWrapperComponent>{children}</CaptchaWrapperComponent>
        <footer>
          <FooterComponent />
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
