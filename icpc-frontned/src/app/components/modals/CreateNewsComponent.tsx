'use client'
import React from 'react'
import { FieldValues, Controller, useForm, SubmitHandler } from 'react-hook-form'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { IApiResponse, TResponseBasicError, enumTextTags } from '@/constants/types'
import LogoComponent from '../LogoComponent'
import { TextComponent } from '../text/TextComponent'
import TextFieldComponent from '../forms/TextFieldComponent'
import SubmitComponent from '../forms/SubmitComponent'
import ImageInputComponent from '../forms/ImageInputComponent'
import MarkdownAreaComponent from '../forms/MarkdownAreaComponent'
import useNewsStore from '@/store/useNewsStore'
import useUtilsStore from '@/store/useUtilsStore'
import { toast } from 'sonner'
import useAuthStore from '@/store/useStore'

/*
Input: None
Output: a form to create a news article
Return value: a modal form component to create a news article
Function: creates a form to create a news article
Variables: methods
Date: 07 - 05 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const CreateNewsComponent = () => {
  const methods = useForm<FieldValues>()
  const createNews = useNewsStore(state => state.createNews)
  const createImage = useUtilsStore((state: { createImage: (image: File) => Promise<IApiResponse<{}> | TResponseBasicError> }) => state.createImage)

  const onSubmit: SubmitHandler<FieldValues> = async formData => {
    const uploadedImage = await createImage(formData.file)
    if ('data' in uploadedImage) {
      const response = await createNews({
        title: String(formData.title),
        imageId: uploadedImage.data?.id,
        body: String(formData.content),
        userAuthor: String(useAuthStore.getState().user?.userName),
        role: String(useAuthStore.getState().user?.role)
      })
      if ('statusCode' in response && response.statusCode === 201) {
        toast.success(response.message, {
          duration: 5000,
          style: {
            backgroundColor: 'green',
            color: '#ffffff'
          }
        })
      } else {
        if ('message' in response) {
          toast.error(response.message, {
            duration: 5000,
            style: {
              backgroundColor: '#ff0000',
              color: '#ffffff'
            }
          })
        }
      }
    } else {
      if ('message' in uploadedImage) {
        toast.error(uploadedImage.message as string, {
          duration: 5000,
          style: {
            backgroundColor: '#ff0000',
            color: '#ffffff'
          }
        })
      }
    }
  }

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={`margin-auto md:mx-auto max-w-7xl md:px-4 w-full h-full lg:px-8 lg:w-2/3 lg:h-auto 
    min-h-screen place-items-center justify-between py-24`}>
      <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary'>
        <div className='flex flex-col items-center'>
          <LogoComponent size={100} />
          <TextComponent
            tag={enumTextTags.h1}
            sizeFont='s16'
            className='dark:text-dark-accent'>
            Crear noticia
          </TextComponent>

          <TextFieldComponent
            labelText='Título'
            fieldName='title'
            id='title'
            register={methods.register}
            necessary={true}
            auto='off'
            type='text'
            className='m-4'
          />
          <Controller
            name='file'
            defaultValue={null}
            control={methods.control}
            rules={{required:true}}
            render={({ field }) => (
              <ImageInputComponent
                value={field.value}
                register={methods.register}
                onChange={field.onChange}
                fieldName='file'
              />
            )}
          />

          <Controller
            name='content'
            defaultValue=''
            control={methods.control}
            render={({ field }) => (
              <MarkdownAreaComponent
                value={field.value}
                onChange={newValue => field.onChange(newValue)}
                labelText='Cuerpo de la noticia'
                className='p-2'
              />
            )}
          />
          <SubmitComponent text='Crear noticia' />
        </div>
        <div className='mt-4'>
          <button
            type='button'
            className='inline-flex items-center gap-x-2 rounded-md bg-primary text-complementary px-3.5 py-2.5 
              font-medium shadow-sm hover:bg-secondary focus-visible:outline 
              focus-visible:outline-offset-2 focus-visible:outline-complementary'
            >
            {}Borrar formulario
          </button>
        </div>
      </BasicPanelComponent>
    </form>
  )
}

export default CreateNewsComponent
