'use client'

import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

interface IColorPickerProps {
  register: UseFormRegister<FieldValues>
  fieldName: string
  id: string
}

const ColorPickerComponent = ({ register, fieldName, id }: Readonly<IColorPickerProps>) => {
  const [color, setColor] = useState('#000000')
  useEffect(() => {
  }, [color])
  return (
    <input
      type='color' {...register(fieldName)} id={id}
      onChange={(e) => setColor(e.target.value)} className='h-8 rounded-md m-4'></input>
  )
}

export default ColorPickerComponent
