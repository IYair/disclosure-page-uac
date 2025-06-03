'use client'
import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import { TextComponent } from '../text/TextComponent'

/*
Input: A register for the values of the form, an onChange function to handle file changes,
a field name for the input, the current value of the file, and an optional cover image URL
Output: An object with properties for the ImageInputComponent
Return value: An object with the properties of the ImageInputComponent
Function: To describe the properties (required and optional) of the ImageInputComponent
Variables: register, onChange, fieldName, value, cover
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface IImageInputProps {
  register: UseFormRegister<FieldValues>
  onChange: (newValue: File | null) => void
  fieldName: string
  value: File | null
  cover?: string
}

/*
Input: An object with properties described in the IImageInputProps interface, see above
Output: A form input to upload an image
Return value: A React Node
Function: Creates an input to upload an image to use as cover for the news articles
Variables: register, setValue, fieldName, fileElem, selectedFile, handleFileChange
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const ImageInputComponent = forwardRef(({ cover, ...props }: IImageInputProps, ref) => {
  const fileElem = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(cover ?? null)
  const [selectedFile, setSelectedFile] = useState(!!cover)
  const iconURL = '/icons/image.svg'

  useImperativeHandle(ref, () => ({
    resetImageInput: (newCover: string | null = null) => {
      if (newCover) {
        setImage(`${process.env.NEXT_PUBLIC_API_URL}api/v1/image/${newCover}`)
        setSelectedFile(true)
        props.onChange(null)
      } else {
        setImage(null)
        setSelectedFile(false)
        props.onChange(null)
      }
      if (fileElem.current) {
        fileElem.current.value = ''
      }
    }
  }))

  // Effect hook to set the image URL when the component mounts or when the cover changes
  useEffect(() => {
    // If cover is provided, set the image URL and mark as selected
    if (cover) {
      setImage(`${process.env.NEXT_PUBLIC_API_URL}api/v1/image/${cover}`)
      setSelectedFile(true)
      // Otherwise, display a default icon and mark as not selected
    } else {
      setImage(null)
      setSelectedFile(false)
    }
  }, [cover])

  // Function to handle file changes when a new image is selected
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
      className='relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center
       hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 overflow-hidden'
       // When the user clicks the button, redirect the click to the actual image input
      onClick={() => fileElem.current?.click()}>
      <div className='flex items-center justify-center w-full h-40 max-h-40'>
        <img
          className='max-w-96 max-h-full object-contain'
          // If the user has selected a file and there's an image, display it; otherwise, show the icon
          src={selectedFile && image ? image : iconURL}
          alt='Ícono de subida'
        />
      </div>
      <TextComponent
        className='mt-2 block font-semibold text-gray-900 dark:text-dark-accent'
        sizeFont='s12'>
        {/* Display the appropriate text if the user has uploaded an image */}
        {selectedFile ? 'Imagen seleccionada' : 'Sube una imagen de portada*'}
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
})

ImageInputComponent.displayName = 'ImageInputComponent'

export default ImageInputComponent
