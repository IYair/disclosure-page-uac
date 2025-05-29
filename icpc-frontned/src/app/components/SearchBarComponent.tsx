'use client'
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import useExcerciseStore from '@/store/useExcerciseStore';
import useNewsStore from '@/store/useNewsStore';
import useNoteStore from '@/store/useNoteStore';

/*
Input: None (uses hooks and store state)
Output: Search bar UI with autocomplete and navigation
Return value: JSX.Element (search bar)
Function: Provides a search bar that fetches and displays search results for exercises, news, and notes, and navigates to the selected item
Variables: options, inputValue, isClient, router, exerciseSearch, newsSearch, notesSearch
Date: 29 - 05 - 2025
Author: Gerardo Omar Rodriguez Ramirez
*/
const SearchBarComponent = () => {
  const [options, setOptions] = useState<{ value: string; label: string; type: string; url: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const exerciseSearch = useExcerciseStore(state => state.search);
  const newsSearch = useNewsStore(state => state.search);
  const notesSearch = useNoteStore(state => state.search);

  // Effect to set isClient to true after the component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect to fetch options based on inputValue
  useEffect(() => {
    const fetchOptions = async () => {
      if (inputValue.trim() === '') return;

      try {
        const [exercisesResponse, newsResponse, notesResponse] = await Promise.all([
          exerciseSearch(inputValue),
          newsSearch(inputValue),
          notesSearch(inputValue)
        ]);

        const exercisesOptions = exercisesResponse.map((option: any) => ({
          value: option.id,
          label: option.title,
          type: 'exercise',
          url: `/exercises/${option.id}`
        }));

        const newsOptions = newsResponse.map((option: any) => ({
          value: option.id,
          label: option.title,
          type: 'news',
          url: `/news/${option.id}`
        }));

        const notesOptions = notesResponse.map((option: any) => ({
          value: option.id,
          label: option.title,
          type: 'note',
          url: `/note/${option.id}`
        }));

        setOptions([...exercisesOptions, ...newsOptions, ...notesOptions]);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [inputValue]);

  // Function to handle input changes
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  // Function to handle option selection
  const handleChange = (selectedOption: any) => {
    router.push(selectedOption.url);
  };

  // If not client-side, return null to avoid rendering on the server
  if (!isClient) {
    return null;
  }

  return (
    <div className='w-full max-w-lg lg:max-w-xs'>
      <label htmlFor='search' className='sr-only'>
        Search
      </label>
      <div className='relative'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
        </div>
        <Select
          id='search'
          name='search'
          className='w-full rounded-md py-1.5 pl-10 pr-3 text-black'
          placeholder='Buscar'
          options={options}
          onInputChange={handleInputChange}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default SearchBarComponent;