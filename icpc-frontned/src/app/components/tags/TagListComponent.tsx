import React from 'react'
import TagComponent from './TagComponent'
import cn from 'classnames'
import { Tags } from '@/constants/types'

/*
Input: tags (array of Tags objects), showIcon (boolean to show close icon), className (optional string for custom classes)
Output: TagListProps object for TagListComponent
Return value: TagListProps interface
Function: Describes the properties for the TagListComponent (list of tags, icon visibility, custom class)
Variables: tags, showIcon, className
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface TagListProps {
  tags: Tags[]
  showIcon: boolean
  className?: string
}

/*
Input: tags (array of Tags), showIcon (boolean), className (optional string)
Output: List of TagComponent elements rendered in a flex container
Return value: JSX.Element (TagListComponent UI)
Function: Renders a list of tags using TagComponent, with optional close icons and custom styling
Variables: style, props
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const TagListComponent = ({ ...props }: Readonly<TagListProps>) => {
  const style = cn('flex flex-wrap gap-x-2', props.className)
  return (
    <div className={style}>
      {/* Loop through all tags in the list */}
      {props.tags.map((tag, index) => (
        <TagComponent
          key={index}
          tagName={tag.name}
          color={tag.color}
          showIcon={props.showIcon}
        />
      ))}
    </div>
  )
}

export default TagListComponent
