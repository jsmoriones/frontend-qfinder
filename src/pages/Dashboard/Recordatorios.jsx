import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import AnimatedModal, { useModal } from "@jdthornton/animated-modal";

import '@jdthornton/animated-modal/styles.css';
import 'moment/locale/es';
import TimePicker from '../../components/DatePicker/DatePicker';
import { TitleDashboardSection } from '../../components/ui/TitleDashboardSection';

moment.locale("es");

const eventosEjempo =[
    {
      start: new Date(2025, 4, 20, 10, 0, 0), // Año, Mes (0-indexado), Día, Hora, Minuto, Segundo
      end: new Date(2025, 4, 20, 12, 0, 0),
      title: 'Reunión de equipo',
    },
    {
      start: new Date(2025, 4, 22, 14, 30, 0),
      end: new Date(2025, 4, 22, 15, 45, 0),
      title: 'Presentación del proyecto',
    },
  ]


const Recordatorios = () => {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [dateSelected, setDateSelected] = useState(null)
  const [recordatorio, setRecordatorio] = useState([]);
  const [meetingTime, setMeetingTime] = useState("09:30");

  const [typeRecord, setTypeRecord] = useState([
    {
      value: "Medicamentos",
      status: true,
    },
    {
      value: "Citas",
      status: false,
    }
  ]);

  const localizer = momentLocalizer(moment);
  const { isOpen, open, close } = useModal();
  const { isOpen: modalHour, open: modalOpen, close: modalClose } = useModal();

  const traduccionTexto = {
    allDay: 'Todo el día',
    previous: '<',
    next: '>',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango.',
    showMore: total => `+${total} más`
  }

  const isDateNotBeforeToday = (selectedDateString) => {
    const [year, month, day] = selectedDateString.split('-').map(Number);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() >= today.getTime();
  };

  const handleAddEvent = () => {
    open()
  }

  const handleNavigate = (newDate) => {
    setFechaActual(newDate);
  };

  const handleSelectSlot = (evento) => {
    console.log(evento)
    const dateFormated =  moment(evento.start).format('YYYY-MM-DD')
    
    if(isDateNotBeforeToday(dateFormated)){
      setDateSelected(evento.start)
      modalOpen()
    }else{
      setDateSelected(null)
    }


  }
  const daySelected = (date) => {
    if (dateSelected && moment(date).isSame(dateSelected, 'day')) {
      return {
        className: 'dia-seleccionado',
        style: {
          backgroundColor: '#8FBFFF'
        },
      };
    }
    return {};
  }
  
  const handleSetAction = () => {
    const r = typeRecord.map(type => {
      return {
        value: type.value,
        status: !type.status
      }
    })
    setTypeRecord(r)
  }

  const handleMeetingTimeChange = (newTime) => {
    // Guarda la hora en el estado (si necesitas que sea un string con AM/PM)
    //setMeetingTime(newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    
    // Obtén la cadena de tiempo con AM/PM para verificar
    const timeString = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    setMeetingTime(timeString)

    console.log(timeString)
    modalClose();
  };

  return (
    <div>
      <TitleDashboardSection
        text={"Recordatorios"}
      />

      <div className="bg-azulPastel1 rounded-xl p-3 flex gap-5">
        <div className="w-1/2 bg-white rounded-xl p-3">
          <div className='bg-grisTarde6 rounded-xl overflow-hidden' style={{ height: 400 }}>
            <Calendar
              localizer={localizer}
              events={eventosEjempo}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              date={fechaActual}
              messages={traduccionTexto}
              selectable={true} 
              onNavigate={handleNavigate}
              onSelectEvent={(e) => console.log(e)}
              dayPropGetter={daySelected}
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-4">
          <div className="w-full p-3 bg-white rounded-xl flex gap-8">
            <div className="w-1/2 flex flex-col items-start justify-between py-8">
              <p className="flex flex-col items-center gap-2 font-bold text-xl text-oscurity">
                <span>Citas pendientes:</span>
                <span>3</span>
              </p>
              <p className="flex flex-col items-center gap-2 font-bold text-xl text-oscurity">
                <span>Citas pasadas:</span>
                <span>5</span>
              </p>
              <p className="flex flex-col items-center gap-2 font-bold text-xl text-oscurity">
                <span>Total citas del mes:</span>
                <span>8</span>
              </p>
            </div>
            <div className="w-1/2">
              <img src="/images/patient.png" alt="imagen de paciente" className='w-full' />
            </div>
          </div>
          <div className="w-full p-3 bg-white rounded-xl flex flex-col gap-5">
            <div className="bg-rosa p-3 py-5 border-rosa2 border-1 rounded-xl">
              <p className='font-bold text-oscurity text-xl'>Citas</p>
              <ul className='pl-6 mt-2 flex flex-col gap-1'>
                <li className='list-disc'>10 mayo de 2025 - medico general</li>
                <li className='list-disc'>22 mayo de 2025 - especialista</li>
                <li className='list-disc'>23 mayo de 2025 - neurología</li>
              </ul>
            </div>
            <div className="bg-verde2 p-3 py-5 border-verde1 border-1 rounded-xl">
              <p className='font-bold text-oscurity text-xl'>Medicamentos</p>
              <ul className='pl-6 mt-2 flex flex-col gap-1'>
                <li className='list-disc'>Silozina - 10:00 am - Lunes</li>
              </ul>
            </div>
            <button
              onClick={handleAddEvent}
              className='cursor-pointer bg-azulPastel5 py-1 px-3 rounded-lg text-oscurity hover:bg-azulPastel2 transition-colors w-fit font-bold text-lg mx-auto'>
              Agregar Recordatorio
            </button>
          </div>
        </div>
      </div>


      {/* <button
        onClick={handleAddEvent}
        className='cursor-pointer bg-azulPastel3 py-1 px-3 rounded-xl text-white hover:bg-azulPastel2 transition-colors'>
        Agregar Recordatorio
      </button> */}

      {/** Modal */}
      <AnimatedModal isOpen={isOpen} close={close} style={{width: "80%"}}>
        <div className='mb-5 text-right'>
          <button onClick={close} className='cursor-pointer'>
            <i class="fa-solid fa-xmark text-4xl font-light"></i>
          </button>
        </div>
        <div className="flex gap-12 pb-8">
          <div className='w-1/2' style={{ height: 400 }}>
            <Calendar
              localizer={localizer}
              events={recordatorio}
              startAccessor="start"
              endAccessor="end"
              titleAccessor="title"
              date={fechaActual}
              messages={traduccionTexto}
              selectable={true} 
              onNavigate={handleNavigate}
              onSelectEvent={(e) => console.log(e)}
              onSelectSlot={handleSelectSlot}
              dayPropGetter={daySelected}
            />
          </div>
          <div className="w-1/2">
            <input type="text" name="title" id="title" placeholder='Titulo' className='outline-none border-b-2 border-b-azulPastel17 placeholder-grisTarde4 text-2xl px-1' />
            <div className="flex gap-3 mt-3">
              {
                typeRecord.map((item, key) => (
                  <p
                    key={key}
                    className={`text-sm p-1 px-3 rounded-xl ${item.status ? "bg-grisTarde5":"bg-azulPastel18"} cursor-pointer`}
                    onClick={handleSetAction}
                  >
                    {item.value}
                  </p>
                ))
              }
            </div>
            {/** Fecha de evento */}
            <div className='flex gap-3 items-center mt-5'>
              <i className="fa-solid fa-clock text-xl"></i>
              <p className="">{moment(dateSelected).format('LL') || "1 de may 2025"}   -   {meetingTime ||"10: 00 am"}</p>
            </div>
            {/** caja de texto de descripcion */}
            <div className="w-full mt-4 border-b-grisTarde6 border-b-2 pb-3 px-5">
              <textarea
                id="descripcion"
                className="shadow appearance-none border rounded-xl w-full p-3 bg-grisTarde6 text-gray-700 leading-tight resize-none border-none focus:outline-none focus:shadow-outline"
                rows="4"
                placeholder='Descripcion'
              ></textarea>
            </div>
            {/**  */}
            <div className='flex gap-3 items-center mt-5 mb-3'>
              <i className="fa-regular fa-bell text-xl"></i>
              <p className="">Recordarme 1 dia antes</p>
            </div>
            <div className='flex gap-3 items-center border-b-grisTarde6 border-b-2 pb-5'>
              <i className="fa-regular fa-calendar text-xl"></i>
              <p className="">Programar para recordar el mismo dia</p>
            </div>

            <div className="w-full text-center mt-6">
              <input type="button" value="Enviar" className='bg-azulPastel18 rounded-lg px-6 py-1 cursor-pointer' />
            </div>
          </div>
        </div>
      </AnimatedModal>

      <AnimatedModal isOpen={modalHour} close={modalClose} style={{overflow: "visible"}}>
        <TimePicker
          label="Hora de inicio de la reunión"
          initialTime={meetingTime}
          onChange={handleMeetingTimeChange}
          minuteStep={1}
          format="12h" 
        />
      </AnimatedModal>
    </div>
  )
}

export default Recordatorios