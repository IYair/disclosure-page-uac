import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

/*
Input: none
Output: a set of hyperlinks to navigate through a list of items
Return value: a set of hyperlinks as a component
Function: creates a set of hyperlinks to jump to different pages of a list of items
Variables: none
Date: 11 - 04 - 2024
Author: Gerardo Omar Rodriguez Ramirez
*/
export const PaginationComponent = () => {
  return (
    <nav className='flex items-center justify-between border-t border-gray-200 px-4 pt-4 sm:px-0'>
      <div className='-mt-px flex w-0 flex-1'>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent pr-1 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          <ArrowLongLeftIcon
            className='mr-3 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
          Previous
        </a>
      </div>
      <div className='hidden md:-mt-px md:flex'>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          1
        </a>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-indigo-500 
        px-4 pt-4 text-sm font-medium text-indigo-600'
          aria-current='page'>
          2
        </a>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent 
        px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          3
        </a>
        <span className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500'>...</span>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          8
        </a>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          9
        </a>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent px-4 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          10
        </a>
      </div>
      <div className='-mt-px flex w-0 flex-1 justify-end'>
        <a
          href='#'
          className='inline-flex items-center border-t-2 border-transparent pl-1 pt-4 
        text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'>
          Next
          <ArrowLongRightIcon
            className='ml-3 h-5 w-5 text-gray-400'
            aria-hidden='true'
          />
        </a>
      </div>
    </nav>
  )
}
