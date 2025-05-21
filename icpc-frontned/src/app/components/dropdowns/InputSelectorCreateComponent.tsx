import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { TextComponent } from '../text/TextComponent';
import { enumTextTags, Option } from '@/constants/types';
import CreatableSelect from 'react-select/creatable';
import { StylesConfig, SelectInstance } from 'react-select';
import chroma from 'chroma-js';

interface InputSelectorCreateProps {
  options: Option[];
  selectedOption: Option | null;
  id: string;
  label: string;
  onChange: (val: Option | null) => void;
  handleCreate: (val: Option) => void;
}

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

const InputSelectorCreateComponent = forwardRef(
  ({ options, selectedOption, id, label, onChange, handleCreate }: InputSelectorCreateProps, ref) => {
    const inputRef = useRef<SelectInstance<Option>>(null);

    // Exponer el método `clear` al componente padre
    useImperativeHandle(ref, () => ({
      clear() {
        inputRef.current?.clearValue(); // Limpia el valor seleccionado
        onChange(null); // Notifica automáticamente al componente padre
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
          value={selectedOption} // Usar valor controlado
          isSearchable={true}
          isClearable={true}
          styles={colourStyles}
          getOptionLabel={option => option.label}
          getOptionValue={option => option.value}
          ref={inputRef}
          onChange={newValue => {
            onChange(newValue); // Notifica al padre sobre cambios
          }}
          onCreateOption={inputValue => {
            const newOption = { label: inputValue, value: inputValue };
            handleCreate(newOption); // Agrega la nueva opción
            onChange(newOption); // Notifica con la nueva opción
          }}
        />
      </div>
    );
  }
);

export default InputSelectorCreateComponent;
