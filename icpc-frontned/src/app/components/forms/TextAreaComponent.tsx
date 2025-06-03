import React from 'react'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags } from '@/constants/types'
import { FieldValues, UseFormRegister } from 'react-hook-form'

/*
Input: A string to act as a label, a register for the value, a field name for the form,
an id string, a boolean to indicate if the field is required
Output: An object with properties for the TextAreaComponent
Return value: An object with the properties of the TextAreaComponent
Function: To describe the properties (required and optional) of the TextAreaComponent
Variables: labelText, register, fieldName, id, necessary
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ITextAreaProps {
  labelText: string
  register: UseFormRegister<FieldValues>
  fieldName: string
  id: string
  necessary: boolean
}

const labelClassname = 'place-self-start dark:text-dark-accent my-2'
const textAreaClassname = `block w-full rounded-md p-2 text-dark-primary shadow-sm
ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-accent h-20 text-wrap overflow-y-auto`

/*
Input: An object with properties described in the ITextAreaProps interface, see above
Output: A text area with a label
Return value: A React Node
Function: Creates a component to write a multi-line text in a form
Variables: labelText, register, fieldName, id, necessary
Date: 22 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const TextAreaComponent = ({ labelText, register, fieldName, id, necessary }: Readonly<ITextAreaProps>) => {
  return (
    <div className='w-full min-h-max'>
      <TextComponent
        htmlFor={id}
        className={labelClassname}
        tag={enumTextTags.label}>
        {labelText}
      </TextComponent>
      <textarea
        {...register(fieldName)}
        required={necessary}
        className={textAreaClassname}
        id={id}
      />
    </div>
  )
}

export default TextAreaComponent
