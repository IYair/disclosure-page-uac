'use client'
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SearchBarComponent = () => {
  const [options, setOptions] = useState<{ value: string; label: string; type: string; url: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      if (inputValue.trim() === '') return;

      console.log('Fetching options for:', inputValue); // Log para depuración

      try {
        const [exercisesResponse, newsResponse] = await Promise.all([
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/v1/excercises/search/${inputValue}`),
          axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/v1/news/search/${inputValue}`)
        ]);

        console.log('Exercises response data:', exercisesResponse.data); // Log para depuración
        console.log('News response data:', newsResponse.data); // Log para depuración

        const exercisesOptions = exercisesResponse.data.map((option: any) => ({
          value: option.id,
          label: option.title,
          type: 'exercise',
          url: `/exercises/${option.id}`
        }));

        const newsOptions = newsResponse.data.map((option: any) => ({
          value: option.id,
          label: option.title,
          type: 'news',
          url: `/news/${option.id}`
        }));

        setOptions([...exercisesOptions, ...newsOptions]);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, [inputValue]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };

  const handleChange = (selectedOption: any) => {
    console.log('Selected option:', selectedOption);
    router.push(selectedOption.url);
  };

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
          className='w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-black ring-1 ring-inset ring-gray-300 focus:ring-indigo-600'
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