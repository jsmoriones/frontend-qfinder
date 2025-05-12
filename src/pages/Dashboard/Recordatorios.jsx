import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

const Recordatorios = () => {
  return (
    <div>
        <Calendar
            localizer={localizer}
            events={() => console.log("asdas")}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
        />
    </div>
  )
}

export default Recordatorios