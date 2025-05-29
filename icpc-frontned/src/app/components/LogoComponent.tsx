'use client'
import Image from 'next/image'
import logoClearMode from '@/../../public/icons/fdiClearMode.svg'
import logoDarkMode from '@/../../public/icons/fdiDarkMode.svg'
import cn from 'classnames'

/*
Input: size (number, logo size in px), classes (optional string for custom classes)
Output: ILogoProps object for LogoComponent
Return value: ILogoProps interface
Function: Describes the properties for the LogoComponent (size and custom classes)
Variables: size, classes
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ILogoProps {
  size: number
  classes?: string
}

/*
Input: size (number), classes (optional string)
Output: Logo image (SVG) for light and dark mode
Return value: JSX.Element (LogoComponent UI)
Function: Renders the faculty logo, switching between light and dark mode versions based on theme
Variables: size, classes, logoClearMode, logoDarkMode
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export default function LogoComponent({ size, classes }: Readonly<ILogoProps>) {
  return (
    </* Display either the blue version in clear mode or the white version in dark mode */>
      <Image
        src={logoDarkMode}
        alt='Logo de la facultad'
        width={size}
        height={size}
        className={cn(classes,'hidden dark:block')}
        priority={true}></Image>
      <Image
        src={logoClearMode}
        alt='Logo de la facultad'
        width={size}
        height={size}
        className={cn(classes,'block dark:hidden')}
        priority={true}></Image>
    </>
  )
}
