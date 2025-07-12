import React from 'react'
import { TextComponent } from '../text/TextComponent'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { readableColor, getLuminance } from 'polished'

/*
Input: color (string, hex color code), tagName (string, tag label), showIcon (boolean, show close icon)
Output: TagProps object for TagComponent
Return value: TagProps interface
Function: Describes the properties for the TagComponent (color, label, icon visibility)
Variables: color, tagName, showIcon
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface TagProps {
  color: string
  tagName: string
  showIcon: boolean
}

/*
Input: backgroundColor (string, hex color code)
Output: string (text color, either #FFFFFF or #000000)
Return value: string (text color)
Function: Determines the appropriate text color for a given background color, forcing white for specific reds
Variables: luminance, forceWhiteFor
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const determineTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  const forceWhiteFor = ['#FF0000', '#E60026', '#C21807'];

  // If the background color is one of the specified colors, force white text
  if (forceWhiteFor.includes(backgroundColor.toUpperCase())) {
    return '#FFFFFF';
  }

  // Custom condition based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/*
Input: color (hex string), tagName (string), showIcon (boolean)
Output: Tag UI element with label and optional close icon
Return value: JSX.Element (TagComponent UI)
Function: Renders a tag with a background color, label, and optional close icon
Variables: backgroundColor, textColor, props
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const TagComponent = ({ ...props }: Readonly<TagProps>) => {
  const backgroundColor = `#${props.color}`
  const textColor = determineTextColor(backgroundColor);

  return (
    <div
      className='rounded-md w-min-content px-3 py-1.5 flex flex-row gap-x-2'
      style={{ backgroundColor: backgroundColor }}>
      <TextComponent
        sizeFont='s12'
        className='font-medium'
        style={{ color: textColor }}>
        {props.tagName}
      </TextComponent>
      {/* If showIcon is true, display the close button */}
      {props.showIcon ? (
        <button>
          <XMarkIcon className='block h-4 w-4' style={{ color: textColor }} />
        </button>
      ) : null}
    </div>
  )
}

export default TagComponent
