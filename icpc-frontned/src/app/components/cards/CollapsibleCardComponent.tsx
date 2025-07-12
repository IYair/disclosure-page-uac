'use client';
import React, { useState } from 'react';
import MarkdownBodyComponent from '../panels/MarkdownBodyComponent';

/*
Input: A title string and a body string to be displayed
Output: An object with properties for the CollapsibleCardComponent
Return value: An object with the properties of the CollapsibleCardComponent
Function: To describe the properties of the CollapsibleCardComponent
Variables: title, body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface CollapsibleCardComponentProps {
  title: string;
  body: string;
}

/*
Input: An object with properties described in the CollapsibleCardComponentProps interface, see above
Output: A collapsible card component that displays a title and body content
Return value: A React Node
Function: To display a card with a title that can be clicked to show or hide either the solution of an exercise in Markdown format
Variables: title, body, isOpen
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const CollapsibleCardComponent: React.FC<CollapsibleCardComponentProps> = ({ title, body }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the card open/close state
  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full rounded-lg shadow-sm ring-1 ring-gray-900/5 bg-white dark:bg-gray-800">
      <div
        className="cursor-pointer p-4 border border-b-2 border-x-0 border-t-0 rounded-lg border-gray-900"
        onClick={toggleCard}
      >
        <h2 className="text-lg font-bold text-accent dark:text-dark-accent">{title}</h2>
      </div>
      {isOpen && (
        <div className="mt-4 p-4">
          <MarkdownBodyComponent body={body} />
        </div>
      )}
    </div>
  );
};

export default CollapsibleCardComponent;