import React from 'react'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags } from '@/constants/types'
import { FieldValues, UseFormRegister } from 'react-hook-form'

/*
Input: labelText, fieldName, register (UseFormRegister)
Output: Props for CheckboxComponent
Return value: ICheckboxProps interface
Function: Describes the properties for the CheckboxComponent
Variables: labelText, fieldName, register
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ICheckboxProps {
    labelText: string
    fieldName: string
    register: UseFormRegister<FieldValues>
}

/*
Input: labelText, register, fieldName (from ICheckboxProps)
Output: Checkbox with label for forms
Return value: React Node (checkbox component)
Function: Renders a checkbox with a label for use in forms
Variables: labelText, register, fieldName
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const CheckboxComponent = ({labelText, register, fieldName }: Readonly<ICheckboxProps>) => {
  return (
    <div className='place-self-start flex flex-row m-2 items-center'>
            <input
              type='checkbox'
              {...register(fieldName)}
            />
            <TextComponent
              tag={enumTextTags.p}
              className='mx-2 dark:text-dark-accent'>
              {labelText}
            </TextComponent>
          </div>
  )
}

export default CheckboxComponent