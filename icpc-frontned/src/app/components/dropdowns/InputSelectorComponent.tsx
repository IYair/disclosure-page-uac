import React, { useRef, useImperativeHandle, forwardRef } from 'react'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags, Option } from '@/constants/types'
import Select, { StylesConfig, SelectInstance } from 'react-select'
import chroma from 'chroma-js'

/*
Input: An array of Option objects, the currently selected option, an id for the selector,
label for the selector, a boolean to indicate if the selector is clearable, and a function to handle changes.
Output: An object with properties for the InputSelectorComponent
Return value: An object with the properties of the InputSelectorComponent
Function: To describe the properties (required and optional) of the InputSelectorComponent
Variables: options, selectedOption, id, label, clearable, onChange
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface InputSelectorProps {
  options: Option[]
  selectedOption: Option | null
  id: string
  label: string
  clearable?: boolean
  onChange: (val: Option | null) => void
}

// Define the styles for the react-select component
const colourStyles: StylesConfig<Option> = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma('black')
    let backgroundColor = undefined
    if (!isDisabled) {
      if (isSelected) {
        backgroundColor = 'white'
      } else if (isFocused) {
        backgroundColor = color.alpha(0.1).css()
      }
    }
    return {
      ...styles,
      backgroundColor,
      color: 'black',
      ':active': {
        ...styles[':active'],
        backgroundColor: 'white'
      }
    }
  }
}

/*
Input: An object with properties described in the InputSelectorProps interface, see above
Output: A searchable selector with the options and the selected value
Return value: A React Node
Function: Creates a component to search and select from a list of options
Variables: options, selectedOption, id, label, clearable, ref
Date: 07 - 05 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

const InputSelectorComponent = forwardRef(
  (
    {
      options,
      selectedOption,
      id,
      label,
      clearable = true,
      onChange
    }: Readonly<InputSelectorProps>,
    ref
  ) => {
    const inputRef = useRef<SelectInstance<Option>>(null)
    const labelClassName = 'place-self-start dark:text-dark-accent'

    useImperativeHandle(ref, () => ({
      clear() {
        inputRef.current?.clearValue()
        onChange(null)
      }
    }))

    return (
      <div className="w-full min-h-max">
        <TextComponent
          className={labelClassName}
          tag={enumTextTags.p}>
          {label}
        </TextComponent>
        <Select
          key={JSON.stringify(selectedOption)}
          instanceId={id}
          options={options}
          value={selectedOption}
          isSearchable={true}
          isMulti={false}
          onChange={onChange}
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          styles={colourStyles}
          isClearable={clearable}
          ref={inputRef}
          classNamePrefix="react-select"
        />
      </div>
    )
  }
)

export default InputSelectorComponent