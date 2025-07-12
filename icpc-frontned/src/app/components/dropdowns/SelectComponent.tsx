import React, { Fragment } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { TextComponent } from '../text/TextComponent';
import { enumTextTags } from '@/constants/types';
import cn from 'classnames';

/*
Input: options (array of {index, id, name}), fieldName, id, labelText, selected, onChange, className
Output: Props for SelectComponent
Return value: ISelectProps interface
Function: Describes the properties for the SelectComponent dropdown
Variables: options, fieldName, id, labelText, selected, onChange, className
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface ISelectProps {
  options: {
    index: number;
    id: string;
    name: string;
  }[];
  fieldName: string;
  id: string;
  labelText: string;
  selected?: string;
  onChange: (value: string) => void;
  className?: string[] | string;
}

/*
Input: classes (array of strings)
Output: a single string of Tailwind CSS
Return value: a string with the CSS classes
Function: joins multiple strings into a single string
Variables: classes
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

/*
Input: a list of options, fieldName, id, label, selected value, onChange handler, className
Output: a dropdown menu with the options
Return value: a dropdown menu component to display the options and return the selected option to a form
Function: creates a dropdown menu with the options to be used in a form
Variables: options, fieldName, id, labelText, selected, onChange, className, reference, classes, open, newSelected, option
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export function SelectComponent({ ...props }: Readonly<ISelectProps>) {
  const reference = React.useRef<HTMLSelectElement | null>(null);
  const classes = cn(props.className, 'w-full');

  return (
    <div className={classes}>
      <TextComponent
        htmlFor={props.id}
        tag={enumTextTags.label}
        className='block text-gray-900 place-self-start dark:text-dark-accent'
      >
        {props.labelText}
      </TextComponent>
      <select
        className='hidden'
        ref={reference}
        id={props.id}
      />
      <Listbox
        value={props.selected || ''} // Use empty string if selected is undefined
        onChange={(newSelected) => {
          props.onChange(newSelected);
          if (reference.current) {
            reference.current.value = newSelected;
            reference.current.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }}
        name={props.fieldName}
      >
        {({ open }) => (
          <>
            <div className="relative">
              <ListboxButton
                className={`relative w-full h-10 items-center cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left 
                  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                  sm:text-sm sm:leading-6 overflow-hidden`}
              >
                <span className="block truncate">
                  {props.selected || 'Elija una opción'} {/* Show selected value or default text */}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base 
                    shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {/* Render each option in the dropdown */}
                  {props.options.map((option) => (
                    <ListboxOption
                      key={option.id}
                      value={option.name}
                      className={({ active }) =>
                        classNames(
                          active ? 'dark:bg-secondary bg-gray-100 text-secondary dark:text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}>
                              {option.name} {/* Show the option name */}
                            </span>
                          </div>

                          {selected ? ( // If the option is selected, show a check icon
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}