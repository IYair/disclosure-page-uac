import React from 'react'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags } from '@/constants/types'
import { FieldValues, UseFormRegister } from 'react-hook-form'
import cn from 'classnames'

/*
Input: A text as a label, a register for the value, a field name for the form,
an autocomplete attribute, an id for the text field, a boolean indicating if the field is required,
a type for the input, a class name for the component, and a placeholder for the input
Output: An object with properties for the TextFieldComponent
Return value: An object with the properties of the TextFieldComponent
Function: To describe the properties (required and optional) of the TextFieldComponent
Variables: labelText, register, fieldName, auto, id, necessary, type, className, placeholder
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ITextFieldProps {
  labelText: string
  register: UseFormRegister<FieldValues>
  fieldName: string
  auto?: 'email' | 'current-password' | 'new-password' | 'username' | 'off' | 'name' | 'last-name'
  id: string
  necessary: boolean
  type: 'email' | 'password' | 'username' | 'text' | 'number'
  className?: string
  placeholder?: string
}

const labelClassname = 'place-self-start dark:text-dark-accent my-2'
const textFieldClassname =
  'block w-full rounded-md p-2 text-dark-primary shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-accent'

/*
Input: An object with the properties described in the ITextFieldProps interface, see above
Output: A text field with a label
Return value: A React Node
Function: Creates a component to write a single line of text in a form
Variables: labelText, register, fieldName, auto, id, necessary, type, className, placeholder, style
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const TextFieldComponent = ({ labelText, placeholder, register, fieldName, auto, id, necessary, type, className }: Readonly<ITextFieldProps>) => {
  const style = cn(className, 'w-full min-h-max')
  return (
    <div className={style}>
      <TextComponent
        htmlFor={id}
        className={labelClassname}
        tag={enumTextTags.label}>
        {labelText}
      </TextComponent>
      <input
        {...register(fieldName)}
        required={necessary}
        className={textFieldClassname}
        type={type}
        id={id}
        autoComplete={auto}
        placeholder={placeholder}
      />
    </div>
  )
}

export default TextFieldComponent
