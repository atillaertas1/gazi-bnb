import React from 'react'
import Select from 'react-select'
import useCountries from '../../hooks/useCountries'

function CountrySelect({value, onChange}) {
    const { getAll } = useCountries();
    console.log(getAll);
  return (
    <div>
        <Select 
            placeholder="Her yer"
            isClearable
            options={getAll()}
            value={value}
            onChange={(value) => onChange(value)}
            formatOptionLabel={(option) => (
                <div className='flex flex-row items-center gap-3'>
                  <div>{option.flag}</div>
                  <div>{option.label},
                    <span className='text-neutral-500 ml-1'>
                      {option.region}
                    </span>
                  </div>
                </div>
            )}
            classNames={{
              control: () => 'p-3 border-2',
              input: () => 'text-lg',
              option: () => 'text-lg'
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              colors: {
                ...theme.colors,
                primary: 'black',
                primary25: '#ffe4e6'
              }
            })}
        />
    </div>
  )
}

export default CountrySelect