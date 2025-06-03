import React from 'react'
import { TextComponent } from '@/app/components/text/TextComponent'
import { enumTextTags } from '@/constants/types'
import LogoComponent from '../LogoComponent'
import Link from 'next/link'

/*
Input: None (no props)
Output: Footer UI with logo, links, help, contact, and copyright
Return value: JSX.Element (FooterComponent UI)
Function: Renders the footer section with logo, social links, help and contact links, and copyright
Variables: none (uses only local constants and imported components)
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const FooterComponent = () => {
  return (
    <div className='w-full flex flex-col gap-2 p-8 mt-20'>
      <LogoComponent size={50} />
      <TextComponent
        tag={enumTextTags.h1}
        className='italic'>
        Del Enigma sin Albas, a Triángulos de Luz
      </TextComponent>
      <div className='flex flex-row gap-2 items-center'>
        <Link href='https://www.youtube.com/channel/UCYYBlF4dRrnQ1gs8sSNzaCw'>
          <img
            src='/icons/youtube.svg'
            alt='Youtube'
            className='h-6 w-6'
          />
        </Link>
        <Link href='https://www.facebook.com/people/Facultad-de-Ingenier%C3%ADa-UAC/100063708623660/'>
          <img
            src='/icons/facebook.svg'
            alt='Facebook'
            className='h-6 w-6'
          />
        </Link>
        <Link href='https://twitter.com/fdi_uac'>
          <img
            src='/icons/twitter.svg'
            alt='Twitter'
            className='h-5 w-5'
          />
        </Link>
        <Link href='https://github.com/IYair/disclosure-page-uac'>
          <img
            src='/icons/github.svg'
            alt='github'
            className='h-6 w-6 hover:fill-dark-complementary'
          />
        </Link>
      </div>
      <div className='flex flex-row gap-4'>
        <div className='flex flex-col gap-2'>
          <TextComponent
            tag={enumTextTags.h1}
            className='dark:text-dark-accent'>
            Ayuda
          </TextComponent>
          <a
            href='https://docs.google.com/document/d/1-aLK5OST6Cspt5T3QcoaWOvk18ReNOFkL9ll7dWVWlc/edit?usp=sharing'
            target='_blank'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Guía de usuario
            </TextComponent>
          </a>
          <a
            href='https://docs.google.com/document/d/1Vfu5OLYlcCr0F3ME8G9lROPt1UpBiGCdAMaQGelLA3Y/edit?usp=sharing'
            target='_blank'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Guía de entrenador
            </TextComponent>
          </a>
          <a
            href='https://docs.google.com/document/d/1J0NTvy99DgoFfp2tCWQRubL1emRJGJzVcIvkBxUTw5s/edit?usp=sharing'
            target='_blank'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Guía de administrador
            </TextComponent>
          </a>
          <a
            href='https://docs.google.com/document/d/1J0NTvy99DgoFfp2tCWQRubL1emRJGJzVcIvkBxUTw5s/edit?tab=t.0#heading=h.lp2ddy70jda2'
            target='_blank'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Manual de programador
            </TextComponent>
          </a>
        </div>
        <div className='flex flex-col gap-2'>
          <TextComponent
            tag={enumTextTags.h1}
            className='dark:text-dark-accent'>
            Contacto
          </TextComponent>
          <Link href='/about'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Acerca de nosotros
            </TextComponent>
          </Link>
          <Link href='/privacy'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Política de privacidad
            </TextComponent>
          </Link>
          <Link href='https://uacam.mx/'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Universidad Autónoma de Campeche
            </TextComponent>
          </Link>
          <Link href='https://fi.uacam.mx/'>
            <TextComponent
              tag={enumTextTags.p}
              className='hover:text-secondary dark:text-dark-accent underline hover:dark:text-dark-complementary'>
              Facultad de Ingeniería
            </TextComponent>
          </Link>
        </div>
      </div>
      <TextComponent tag={enumTextTags.p}>© 2023 - 2026. Todos los derechos reservados</TextComponent>
    </div>
  )
}

export default FooterComponent
