'use client'
import React, { useState } from 'react'
import ReportCardComponent from '../modals/ReportCardComponent'
import { useForm } from 'react-hook-form'

/*
Input: A string with the type of item ('note', 'exercise', or 'news') and a string with the item ID
Output: An object with properties for the ReportButtonComponent
Return value: An object with the properties of the ReportButtonComponent
Function: To describe the properties (required and optional) of the ReportButtonComponent
Variables: itemType, itemId
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ReportButtonComponentProps {
  itemType: 'note' | 'exercise' | 'news'
  itemId: string
}

/*
Input: A string with the short description of the report, and the content of the report
Output: An object describing the report data to be sent to the database
Return value: An object with the properties of an error report
Function: To describe the properties of a report to be sent to the database
Variables: description, content
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface ReportData {
  description: string
  content: string
}

/*
Input: An instance of ReportButtonComponentProps, see above
Output: A React component that renders a button to report an error
Return value: A React Node
Function: To display a button that opens a modal to report an error, and send that information to the database
Variables: itemType, itemId, showReportCard, methods
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const ReportButtonComponent: React.FC<ReportButtonComponentProps> = ({ itemType, itemId }) => {
  const [showReportCard, setShowReportCard] = useState(false)
  const methods = useForm()

  // Function to handle showing the report card modal
  const handleShowReport = () => setShowReportCard(true)

  // Function to handle the submission of the report
  const handleReportSubmit = (data: ReportData) => {
    setShowReportCard(false)
  }

  // Function to close the modal
  const handleModalClose = () => {
    setShowReportCard(false)
  }

  return (
    <div>
      <button
        className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
        onClick={handleShowReport}>
        Reportar Error
      </button>
      {showReportCard && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50'>
          <div className='rounded-md p-6 w-full max-h-[90%] overflow-y-auto'>
            <ReportCardComponent
              itemType={itemType}
              itemId={itemId}
              onSubmit={handleReportSubmit}
              onCancel={handleModalClose}
              methods={methods}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportButtonComponent
