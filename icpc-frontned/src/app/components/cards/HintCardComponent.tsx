'use client'
import React from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { MDXRemote } from 'next-mdx-remote'

/*
Input: The body of the hint card, which is an mdx string
Output: An object with properties for the HintCardComponent
Return value: An object with the properties of the HintCardComponent
Function: To describe the properties of the HintCardComponent
Variables: body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface HintCardComponentProps {
  body: string
}

/*
***DEPRECATED***
This was used to display hints and solutions to exercises in a card format.
Now it has been replaced by the `CollapsibleCardComponent` and `SimpleCollapsibleCardComponent` which allows for better user interaction.

Input: An object with properties described in the HintCardComponentProps interface, see above
Output: A card component that displays text in MDX format
Return value: A React Node
Function: Create a card with an MDX body that can be rendered in the UI
Variables: body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const HintCardComponent = ({ ...props }: Readonly<HintCardComponentProps>) => {
  return (
    <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary typography'>
      <MDXRemote
        compiledSource={props.body}
        scope={undefined}
        frontmatter={undefined}
      />
    </BasicPanelComponent>
  )
}

export default HintCardComponent
