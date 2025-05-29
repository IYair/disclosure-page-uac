'use client'
import React, { useEffect, useState } from 'react'
import { BasicPanelComponent } from '../panels/BasicPanelComponent'
import { TextComponent } from '../text/TextComponent'
import { enumTextTags, Report } from '@/constants/types'
import useUtilsStore from '@/store/useUtilsStore'
import { ButtonComponent } from '../buttons/ButtonComponent'
import { toast } from 'sonner'
import { XMarkIcon } from '@heroicons/react/20/solid'

/*
Input: The id of the report and a function to close the report modal
Output: An object with properties for the DisplayReportComponent
Return value: An object with the properties of the DisplayReportComponent
Function: To describe the properties of the DisplayReportComponent
Variables: id, onClose
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

interface DisplayReportComponentProps {
  id: string
  onClose: () => void
}

/*
Input: An object with properties described in the DisplayReportComponentProps interface, see above
Output: A modal component to display a report
Return value: A React Node
Function: To fetch and display the content of a report, allowing the user to close it
Variables: id, report, reportBody
Date: 28 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/

const DisplayReportComponent = ({ id, onClose }: Readonly<DisplayReportComponentProps>) => {
  const getReport = useUtilsStore(state => state.getReport)
  const closeReport = useUtilsStore(state => state.closeReport)
  const [report, setReport] = useState<Report | null>(null)
  const [reportBody, setReportBody] = useState<string>('')
  // An effect hook to fetch the report and display it in the UI
  useEffect(() => {
    // Fetch the report data when the component mounts
    const fetchReport = async () => {
      try {
        const response = await getReport(id)
        if ('id' in response) {
          setReport(response)
          setReportBody(response.report)
        }
      } catch (error) {
        console.error('Error fetching report:', error)
      }
    }
    fetchReport()
  }, [id, getReport, setReport, setReportBody])

  // Function to get the URL based on the report item type
  const getUrl = (id: string | undefined) => {
    if (report?.itemType === 'exercise') {
      return `/exercises/${id}`
    } else if (report?.itemType === 'news') {
      return `/news/${id}`
    } else if (report?.itemType === 'note') {
      return `/note/${id}`
    } else {
      return '/'
    }
  }

  // Function to set the report as "closed" in the database and display a success message
  const close = async () => {
    try {
      const response = await closeReport(id)
      if ('id' in response) {
        toast.success('Reporte cerrado exitosamente.', {
          duration: 5000,
          style: {
            backgroundColor: 'green',
            color: '#ffffff'
          }
        })
        onClose()
      }
    } catch (error) {
      toast.error('No se pudo cerrar el reporte.', {
        duration: 5000,
        style: {
          backgroundColor: '#ff0000',
          color: '#ffffff'
        }
      })
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white dark:bg-dark-primary p-6 rounded-lg shadow-lg max-w-3xl w-full'>
        <BasicPanelComponent backgroundColor='bg-white dark:bg-dark-primary typography'>
          <div className='flex w-full justify-end'>
            <div
              className='p-2 hover:bg-gray-100 dark:hover:bg-red-700 transition-colors duration-200 rounded max-w-min max-h-min'
              title='Cerrar formulario'>
              <button
                onClick={onClose}
                className='text-inherit'>
                <XMarkIcon className='h-6 w-6' />
              </button>
            </div>
          </div>
          <TextComponent
            tag={enumTextTags.h1}
            sizeFont='s24'
            className='text-accent dark:text-dark-accent'>
            {report?.summary}
          </TextComponent>
          <TextComponent className='text-accent dark:text-dark-accent'>{reportBody}</TextComponent>
          <TextComponent className='text-accent dark:text-dark-accent'>
            Encontrado en:{' '}
            <a
              className='underline hover:text-dark-complementary'
              target='_blank'
              // This call to the function will grab the first existing id from the report
              href={getUrl(report?.note?.id ?? report?.excercise?.id ?? report?.news?.id)}>
              {/* This will display the first title that exists in the report */}
              {report?.note?.title ?? report?.excercise?.title ?? report?.news?.title}
            </a>
          </TextComponent>
        </BasicPanelComponent>
        <div className='flex justify-center mt-4'>
          <ButtonComponent
            text='Reporte resuelto'
            onClick={close}
          />
        </div>
      </div>
    </div>
  )
}

export default DisplayReportComponent
