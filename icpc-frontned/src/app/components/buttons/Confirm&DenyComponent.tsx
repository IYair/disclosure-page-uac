import React from 'react';

/*
Input: A pair of callback functions
Output: An object with properties for the ConfirmDenyComponent
Return value: An object with the properties of the ConfirmDenyComponent
Function: To define the properties (required and optional) of the ConfirmDenyComponent
Variables: onConfirm, onCancel
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ConfirmDenyProps {
  onConfirm: () => void;
  onCancel: () => void;
}

/*
Input: An object with properties for the ConfirmDenyComponent, see above
Output: A modal component with buttons to confirm or deny an action
Return value: A React component that renders a confirmation modal
Function: To create a confirmation modal and execute a callback function according to the user's choice
Variables: onConfirm, onCancel
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const ConfirmDenyComponent: React.FC<ConfirmDenyProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-dark-primary p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">¿Confirmar Acción?</h2>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Aceptar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDenyComponent;