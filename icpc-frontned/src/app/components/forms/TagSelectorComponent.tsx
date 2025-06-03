import React from 'react'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags, Tags } from '@/constants/types'
import Select, { MultiValue, StylesConfig } from 'react-select'
import chroma from 'chroma-js'

/*
Input: An array of Tags, the currently selected tags, an id for the tag selector,
a function to handle changes, and a label for the tag selector
Output: An object with properties for the TagSelectorComponent
Return value: An object with the properties of the TagSelectorComponent
Function: To describe the properties (required and optional) of the TagSelectorComponent
Variables: options, selectedTags, id, onChange, label
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface TagSelectorProps {
  options: Tags[]
  selectedTags: Tags[]
  id: string
  onChange: (val: Tags[]) => void
  label: string
}

// Define the styles for the react-select component
const colourStyles: StylesConfig<Tags, true> = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color)
    let backgroundColor = undefined
    if (!isDisabled) {
      if (isSelected) {
        backgroundColor = data.color
      } else if (isFocused) {
        backgroundColor = color.alpha(0.1).css()
      }
    }
    return {
      ...styles,
      backgroundColor,
      color: getColor(isDisabled, isSelected, color, data.color),
      cursor: getCursor(isDisabled),

      ':active': {
        ...styles[':active'],
        backgroundColor: getActiveBackgroundColor(isDisabled, isSelected, data.color, color)
      }
    }

    function getColor(isDisabled: boolean, isSelected: boolean, color: chroma.Color, dataColor: string): string {
      if (isDisabled) {
        return '#ccc'
      } else if (isSelected) {
        return chroma.contrast(color, 'white') > 2 ? 'white' : 'black'
      } else {
        return 'black'
      }
    }

    function getCursor(isDisabled: boolean): string {
      return isDisabled ? 'not-allowed' : 'default'
    }

    function getActiveBackgroundColor(
      isDisabled: boolean,
      isSelected: boolean,
      dataColor: string,
      color: chroma.Color
    ): string | undefined {
      if (!isDisabled) {
        return isSelected ? dataColor : color.alpha(0.3).css()
      } else {
        return undefined
      }
    }
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color)
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    }
  },
  multiValueLabel: styles => ({
    ...styles,
    color: 'black'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: `#${data.color}`,
    ':hover': {
      backgroundColor: `#${data.color}`,
      color: 'white'
    }
  })
}

/*
Input: An object with properties described in the TagSelectorProps interface, see above
Output: A tag selector with the options and the selected tags
Return value: A React Node
Function: Creates a component to search and select tags from a list of options
Variables: options { id, name, color }, selectedTags { id, name, color }, id, handleChange, selectedTags
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const TagSelectorComponent = ({ options, selectedTags, id, onChange, label }: Readonly<TagSelectorProps>) => {
  const labelClassname = 'place-self-start dark:text-dark-accent'

  const handleChange = (selectedOptions: MultiValue<Tags>) => {
    const mappedTags = selectedOptions.map(option => {
      return options.find(tag => tag.name === option.name) as Tags
    })
    onChange(mappedTags)
  }

  return (
    <div className='w-full min-h-max'>
      <TextComponent
        className={labelClassname}
        tag={enumTextTags.p}>
        {label}
      </TextComponent>
      <Select
        instanceId={id}
        options={options}
        value={selectedTags}
        isSearchable={true}
        isMulti={true}
        onChange={(newValue: MultiValue<Tags>) => handleChange(newValue)}
        styles={colourStyles}
        getOptionLabel={option => option.name}
        getOptionValue={option => option.id.toString()}
      />
    </div>
  )
}

export default TagSelectorComponent
