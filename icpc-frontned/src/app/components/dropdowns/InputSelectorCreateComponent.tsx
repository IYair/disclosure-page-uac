import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { TextComponent } from '../text/TextComponent';
import { enumTextTags, Option } from '@/constants/types';
import CreatableSelect from 'react-select/creatable';
import { StylesConfig, SelectInstance } from 'react-select';
import chroma from 'chroma-js';

/*
Input: An array of Option objects, the currently selected option, an id for the selector,
label for the selector, a function to handle changes, and a function to handle creating new options.
Output: An object with properties for the InputSelectorCreateComponent
Return value: An object with the properties of the InputSelectorCreateComponent
Function: To describe the properties (required and optional) of the InputSelectorCreateComponent
Variables: options, selectedOption, id, label, onChange, handleCreate
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface InputSelectorCreateProps {
  options: Option[];
  selectedOption: Option | null;
  id: string;
  label: string;
  onChange: (val: Option | null) => void;
  handleCreate: (val: Option) => void;
}

// Define the styles for the react-select component
const colourStyles: StylesConfig<Option> = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { isDisabled, isFocused, isSelected }) => {
    const color = chroma('black');
    let backgroundColor = undefined;
    if (!isDisabled) {
      if (isSelected) {
        backgroundColor = 'white';
      } else if (isFocused) {
        backgroundColor = color.alpha(0.1).css();
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
    };
  }
};

/*
Input: An object with properties described in the InputSelectorCreateProps interface, see above
Output: A creatable selector with the options and the selected value, allowing users to create new options 
Return value: A React Node
Function: Create a selector where the users can write a query to search an item and create new options
Variables: options, selectedOption, id, label, onChange, handleCreate, ref
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const InputSelectorCreateComponent = forwardRef(
  ({ options, selectedOption, id, label, onChange, handleCreate }: InputSelectorCreateProps, ref) => {
    const inputRef = useRef<SelectInstance<Option>>(null);

    useImperativeHandle(ref, () => ({
      clear() {
        inputRef.current?.clearValue();
        onChange(null);
      }
    }));

    return (
      <div className="w-full min-h-max">
        <TextComponent className="place-self-start dark:text-dark-accent" tag={enumTextTags.p}>
          {label}
        </TextComponent>
        <CreatableSelect
          instanceId={id}
          options={options}
          value={selectedOption}
          isSearchable={true}
          isClearable={true}
          styles={colourStyles}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          ref={inputRef}
          onChange={newValue => {
            onChange(newValue);
          }}
          onCreateOption={inputValue => {
            const newOption = { label: inputValue, value: inputValue };
            handleCreate(newOption);
            onChange(newOption);
          }}
        />
      </div>
    );
  }
);

export default InputSelectorCreateComponent;
