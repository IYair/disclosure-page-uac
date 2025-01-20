'use client'
import React, { useRef, useState, useEffect } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { TextComponent } from '../text/TextComponent'

interface IImageInputProps {
  register: UseFormRegister<FieldValues>
  onChange: (newValue: File | null) => void
  fieldName: string
  value: File | null
  resetImage: boolean
}

/*
Input: a register function, an onChange handler, and reset logic
Output: a form input to upload an image
Return value: a form input to upload an image to a form
Variables: register, onChange, fieldName, fileElem, image, setSelectedFile
Date: 19 - 01 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const ImageInputComponent = ({ resetImage, ...props }: Readonly<IImageInputProps>) => {
  const fileElem = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState(false)
  const iconURL = '/icons/image.svg'

  // Resetear imagen cuando la prop resetImage cambie
  useEffect(() => {
    if (resetImage) {
      setImage(null)
      setSelectedFile(false)
      props.onChange(null) 
    }
  }, [resetImage, props])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setImage(URL.createObjectURL(file))
      props.onChange(file)
      setSelectedFile(true)
    } else {
      setImage(null)
      props.onChange(null)
      setSelectedFile(false)
    }
  }

  return (
    <button
      type='button'
      className={`relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center
       hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      onClick={() => {
        fileElem.current?.click()
      }}>
      <img
        className={selectedFile ? 'mx-auto' : 'mx-auto h-6 w-6'}
        src={selectedFile && image ? image : iconURL}
        alt='Ícono de subida'
      />
      <TextComponent
        className='mt-2 block font-semibold text-gray-900 dark:text-dark-accent'
        sizeFont='s12'>
        {selectedFile ? 'Imagen seleccionada' : 'Sube una imagen de portada'}
      </TextComponent>
      <input
        {...props.register(props.fieldName)}
        type='file'
        ref={fileElem}
        accept='image/*'
        className='hidden'
        onChange={handleFileChange}
      />
    </button>
  )
}

export default ImageInputComponent
