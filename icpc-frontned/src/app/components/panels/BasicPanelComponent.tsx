import cn from 'classnames'

/*
Input: children (React.ReactNode), backgroundColor (optional string)
Output: Props for BasicPanelComponent
Return value: IBasicPanelComponentProps interface
Function: Describes the properties for the BasicPanelComponent
Variables: children, backgroundColor
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
interface IBasicPanelComponentProps {
    children: React.ReactNode;
    backgroundColor?: string;
}

/*
Input: children, backgroundColor (from IBasicPanelComponentProps)
Output: Panel component with custom background and children
Return value: React Node (panel component)
Function: Renders a styled panel with a background color and children content
Variables: classes, children, backgroundColor
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
export const BasicPanelComponent = ({children, backgroundColor = 'bg-white'}: IBasicPanelComponentProps) => {
  const classes = cn(`overflow-hidden rounded-lg shadow`, backgroundColor )
  return (
    <div className={classes}>
      <div className="px-4 py-5 sm:p-6">{children}</div>
    </div>
  )
}
