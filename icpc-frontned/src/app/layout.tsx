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

/*
Input: A list of React Nodes (children), the montserrat font, and metadata for the page
Output: A React component that serves as the root layout for the application
Return value: A React component
Function: It declares the root layout for all pages in the website, including the navbar, footer, and captcha wrapper
Variables: children, metadata, montserrat
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
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
