import { enumTextTags } from '@/constants/types'
import { TextComponent } from '../text/TextComponent'
import { ArrowLongRightIcon } from '@heroicons/react/24/solid'

interface IButtonComponentProps {
  text: string;
  buttonType?: 'button' | 'submit' | 'button_outline';
  icon?: boolean;
  onClick?: () => void;
  className?: string; // Añadido className
}

/*
Input: the text to display in the button, the type of button, and if it has an icon
Output: a button with the text and icon if it has one
Return value: a button component
Function: creates a button component with the text and icon if it has one, setting a default style for the component
Variables: text, buttonType, icon, styles
Date: 21 - 03 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/

export const ButtonComponent = ({ buttonType = 'button', onClick, className, ...props }: IButtonComponentProps) => {
  const styles = {
    button: `inline-flex items-center gap-x-2 rounded-md bg-primary text-complementary px-3.5 py-2.5 
      font-medium shadow-sm hover:bg-secondary focus-visible:outline 
      focus-visible:outline-offset-2 focus-visible:outline-complementary`,
    button_outline: `inline-flex items-center gap-x-2 rounded-md bg-transparent text-primary border-primary
      border px-3.5 py-2.5 font-medium shadow-sm hover:bg-secondary hover:text-complementary
      focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary`
  }

  return (
    <button
      type='button'
      className={`${styles[buttonType as keyof typeof styles] || ''} ${className || ''}`} // Aplicar className
      onClick={onClick}
    >
      <TextComponent
        tag={enumTextTags.span}
        sizeFont='s14'
      >
        {props.text}
      </TextComponent>
      {props.icon && <ArrowLongRightIcon className='w-5 h-5' />}
    </button>
  )
}