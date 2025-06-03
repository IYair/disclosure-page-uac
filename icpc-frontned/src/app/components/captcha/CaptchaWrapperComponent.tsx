'use client'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import React, { ReactNode } from 'react'

/*
Input: A list of React nodes (children) to be wrapped, and a reCaptcha key from environment variables
Output: A React component that provides Google reCaptcha functionality
Return value: A React Node
Function: To create a wrapper component that initializes Google reCaptcha with the provided key
Variables: reCaptchaKey
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export default function CaptchaWrapperComponent({ children }: Readonly<{ children: ReactNode }>) {
  const reCaptchaKey: string | undefined = process.env.NEXT_PUBLIC_CAPTCHA_KEY

  return <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey ?? 'NOT DEFINED'}>{children}</GoogleReCaptchaProvider>
}