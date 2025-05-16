'use client'
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form'
import TextFieldComponent from '../components/forms/TextFieldComponent'
import { BasicPanelComponent } from '../components/panels/BasicPanelComponent'
import SubmitComponent from '../components/forms/SubmitComponent'
import LogoComponent from '../components/LogoComponent'
import { enumTextTags } from '@/constants/types'
import { TextComponent } from '../components/text/TextComponent'

const onSubmit: SubmitHandler<FieldValues> = () => {}

export default function Home() {
  const methods = useForm<FieldValues>()

  return (
    <main className='grid min-h-screen grid-cols-1 place-items-center justify-between py-24'>
      <BasicPanelComponent backgroundColor='bg-gray-300 dark:bg-dark-primary'>
        <div className='grid grid-cols-1 place-items-center justify-between'>
          <LogoComponent size={150} />
          <TextComponent
            tag={enumTextTags.h3}
            sizeFont='s36'
            className='dark:text-dark-accent'>
            Recuperación de contraseña
          </TextComponent>
        </div>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className='grid grid-cols-1 place-items-center justify-between'>
          <TextFieldComponent
            labelText='Ingresa tu correo electrónico'
            register={methods.register}
            fieldName='email'
            auto='email'
            type='email'
            necessary={true}
            id='email'
          />
          <SubmitComponent text='Enviar correo' action={() => {}} />
        </form>
      </BasicPanelComponent>
    </main>
  )
}
