'use client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import React, { ReactNode } from 'react'

export default function CaptchaWrapperComponent({ children }: Readonly<{ children: ReactNode }>) {
  const reCaptchaKey: string | undefined = process.env.NEXT_PUBLIC_CAPTCHA_KEY

  return <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey ?? 'NOT DEFINED'}>{children}</GoogleReCaptchaProvider>
}