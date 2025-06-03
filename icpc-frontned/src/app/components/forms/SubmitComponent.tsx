import React from 'react'

/*
Input: A text string, and an action to execute
Output: An object with properties for the SubmitComponent
Return value: An object with the properties of the SubmitComponent
Function: To describe the properties (required and optional) of the SubmitComponent
Variables: text, action
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ISubmitProps {
  text?: string
  action: () => void
}

/*
Input: An object with properties described in the ISubmitProps interface, see above
Output: A submit button with the text
Return value: A React Node
Function: Creates a button to submit a form
Variables: text, action
Date: 28 - 08 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const SubmitComponent = ({ text, action }: Readonly<ISubmitProps>) => {
  return (
    <button onClick={action}>
      <input
        type='submit'
        className='max-w-min bg-primary rounded-md py-2 px-4 text-complementary dark:bg-dark-accent m-2'
        value={text}
      />
    </button>
  )
}

export default SubmitComponent
