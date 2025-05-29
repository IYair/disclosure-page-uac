'use client'
import React, { useEffect, useState } from 'react'
import { FieldValues, UseFormRegister } from 'react-hook-form'

/*
Input: register (UseFormRegister), fieldName (string), id (string), className (optional string)
Output: Props for ColorPickerComponent
Return value: IColorPickerProps interface
Function: Describes the properties for the ColorPickerComponent
Variables: register, fieldName, id, className
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IColorPickerProps {
  register: UseFormRegister<FieldValues>
  fieldName: string
  id: string
  className?: string
}

/*
Input: register, fieldName, id, className (from IColorPickerProps)
Output: Color picker input for forms
Return value: React Node (color picker component)
Function: Renders a color picker input for use in forms
Variables: color, setColor, register, fieldName, id
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const ColorPickerComponent = ({ register, fieldName, id }: Readonly<IColorPickerProps>) => {
  const [color, setColor] = useState('#000000')
  useEffect(() => {
    // Effect runs when color changes (currently does nothing)
  }, [color])
  return (
    <input
      type='color'
      {...register(fieldName)}
      id={id}
      onChange={e => setColor(e.target.value)}
      className='h-8 rounded-md mx-4 my-1'></input>
  )
}

export default ColorPickerComponent
