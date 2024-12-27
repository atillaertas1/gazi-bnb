import React from 'react'
import { DateRange } from 'react-date-range'
import { enUS } from 'date-fns/locale';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'

function Calendar({value, onChange, disabledDates}) {
  return (
    <div>
        <DateRange
            rangeColors={["#262626"]}
            ranges={[value]}
            date={new Date()}
            onChange={onChange}
            direction='vertical'
            showDateDisplay={false}
            minDate={new Date()}
            disabledDates={disabledDates}
            locale={enUS}
        />
    </div>
  )
}

export default Calendar