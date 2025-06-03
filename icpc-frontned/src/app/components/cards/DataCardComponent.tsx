import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'

/*
Input: A title string, information string, an optional author string, and an optional image URL
Output: An object with properties for the DataCardComponent
Return value: An object with the properties of the DataCardComponent
Function: To describe the properties (required and optional) of the DataCardComponent
Variables: title, info, autor, image
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface IInfoCardComponentProps {
  title: string
  info: string
  autor?: string
  image?: string
}

/*
Input: An object with properties described in the IInfoCardComponentProps interface, see above
Output: a card with the title, information, author, and image if it has one
Return value: A React Node
Function: creates a card component with the title, information, author, and image if it has one
Variables: title, info, autor, image
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

export const DataCardComponent = ({ ...props }: IInfoCardComponentProps) => {
  return (
    <BasicPanelComponent backgroundColor='bg-complementary' >
      <div className='flex flex-col'>
        <TextComponent
          sizeFont='s18'
          className='text-gray-500 font-bold'>
          {props.title}
        </TextComponent>
        <div className='flex gap-4'>
          {props.image ? (
            <img
              src={props.image}
              alt=""
              className='w-full h-40 object-contain rounded-md mt-2'
            />
          ) : (
            <></>
          )}
          <TextComponent
            sizeFont='s14'
            className='text-black mt-2'>
            {props.info}
          </TextComponent>
        </div>
        { props.autor ? (
          <TextComponent
          sizeFont='s14'
          className='text-black mt-4 self-end italic'>
          {props.autor}
        </TextComponent>
        ): <></>}
      </div>
    </BasicPanelComponent>
  )
}
