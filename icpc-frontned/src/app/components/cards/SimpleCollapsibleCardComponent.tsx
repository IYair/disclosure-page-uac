'use client';
import React, { useState } from 'react';
import { TextComponent } from '../text/TextComponent';

/*
Input: A title string and a body string
Output: An object with properties for the SimpleCollapsibleCardComponent
Return value: An object with the properties of the SimpleCollapsibleCardComponent
Function: To describe the properties of the SimpleCollapsibleCardComponent
Variables: title, body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface SimpleCollapsibleCardComponentProps {
  title: string;
  body: string;
}

/*
Input: An object with properties described in the SimpleCollapsibleCardComponentProps interface, see above
Output: A collapsible card component that displays a title and body content
Return value: A React Node
Function: To display a hint for exercises in a card format that can be expanded or collapsed
Variables: isOpen, title, body
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const SimpleCollapsibleCardComponent: React.FC<SimpleCollapsibleCardComponentProps> = ({ title, body }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the card open/close state
  const toggleCard = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm ring-1 ring-gray-900/5">
      <div
        className="cursor-pointer p-4 border border-b-2 border-x-0 border-t-0 rounded-lg border-gray-900"
        onClick={toggleCard}
      >
        <h2 className="text-lg font-bold text-accent dark:text-dark-accent">{title}</h2>
      </div>
      {isOpen && (
        <div className="mt-4 p-4 rounded-lg text-accent dark:text-dark-accent">
          <TextComponent>{body}</TextComponent>
        </div>
      )}
    </div>
  );
};

export default SimpleCollapsibleCardComponent;