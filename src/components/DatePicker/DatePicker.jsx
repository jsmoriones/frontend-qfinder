import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'; // Importa PropTypes para la validación
import './TimePicker.css';

const TimePicker = ({
  label = 'Selecciona una hora',
  initialTime = new Date(),
  onChange,
  minuteStep = 5,
  minHour = 0,
  maxHour = 23,
  format = '24h' // Nuevo prop: '12h' o '24h'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayHour, setDisplayHour] = useState(0); // Hora para mostrar en el input (12h/24h)
  const [selectedHour, setSelectedHour] = useState(0); // Hora interna (24h)
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [ampm, setAmpm] = useState('AM'); // Solo para formato 12h
  const wrapperRef = useRef(null);

  // Efecto para inicializar la hora y minutos
  useEffect(() => {
    let hourToSet, minuteToSet;
    if (initialTime instanceof Date) {
      hourToSet = initialTime.getHours();
      minuteToSet = initialTime.getMinutes();
    } else if (typeof initialTime === 'string' && initialTime.match(/^\d{2}:\d{2}( [AP]M)?$/i)) {
      const parts = initialTime.match(/^(\d{2}):(\d{2})( ([AP]M))?$/i);
      if (parts) {
        let h = Number(parts[1]);
        const m = Number(parts[2]);
        const period = parts[4] ? parts[4].toUpperCase() : '';

        if (period === 'PM' && h < 12) h += 12;
        if (period === 'AM' && h === 12) h = 0; // Medianoche 12 AM es 00 en 24h

        hourToSet = h;
        minuteToSet = m;
      } else {
        const now = new Date();
        hourToSet = now.getHours();
        minuteToSet = now.getMinutes();
      }
    } else {
      const now = new Date();
      hourToSet = now.getHours();
      minuteToSet = now.getMinutes();
    }

    const adjustedMinute = Math.round(minuteToSet / minuteStep) * minuteStep;
    const finalMinute = adjustedMinute >= 60 ? 0 : adjustedMinute;

    setSelectedHour(hourToSet);
    setSelectedMinute(finalMinute);
    updateDisplayTime(hourToSet, finalMinute); // Actualizar la hora mostrada
  }, [initialTime, minuteStep, format]);

  // Manejar clics fuera del componente para cerrarlo
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Opcional: Revertir a la hora inicial si no se ha aplicado
        // updateDisplayTime(initialTime instanceof Date ? initialTime.getHours() : parseInt(initialTime.split(':')[0]),
        //                   initialTime instanceof Date ? initialTime.getMinutes() : parseInt(initialTime.split(':')[1]));
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Función auxiliar para actualizar la hora mostrada y el período (AM/PM)
  const updateDisplayTime = (hour24, minute) => {
    let displayH = hour24;
    let period = 'AM';

    if (format === '12h') {
      period = hour24 >= 12 ? 'PM' : 'AM';
      displayH = hour24 % 12;
      if (displayH === 0) displayH = 12; // 00h (medianoche) -> 12 AM; 12h (mediodía) -> 12 PM
    }
    setDisplayHour(displayH);
    setAmpm(period);
  };

  const handleHourChange = (action) => {
    setSelectedHour((prevHour) => {
      let newHour = prevHour;
      if (action === 'increment') {
        newHour = (prevHour + 1) > maxHour ? minHour : prevHour + 1;
      } else {
        newHour = (prevHour - 1) < minHour ? maxHour : prevHour - 1;
      }
      updateDisplayTime(newHour, selectedMinute); // Actualizar display
      return newHour;
    });
  };

  const handleMinuteChange = (action) => {
    setSelectedMinute((prevMinute) => {
      let newMinute = prevMinute;
      if (action === 'increment') {
        newMinute = (prevMinute + minuteStep);
        if (newMinute >= 60) newMinute = 0;
      } else {
        newMinute = (prevMinute - minuteStep);
        if (newMinute < 0) newMinute = 60 - minuteStep;
      }
      updateDisplayTime(selectedHour, newMinute); // Actualizar display
      return newMinute;
    });
  };

  const handleAmpmChange = () => {
    setSelectedHour((prevHour) => {
      let newHour = prevHour;
      if (ampm === 'AM') { // Cambiar de AM a PM
        if (newHour >= 0 && newHour < 12) newHour += 12;
      } else { // Cambiar de PM a AM
        if (newHour >= 12) newHour -= 12;
      }
      updateDisplayTime(newHour, selectedMinute);
      return newHour;
    });
  };

  // Manejo de entrada manual para hora
  const handleHourInput = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0; // Si no es un número, por defecto 0

    let effectiveValue = value;

    if (format === '12h') {
      // Ajustar la hora ingresada (1-12) a 24h
      if (ampm === 'PM' && value >= 1 && value <= 11) {
        effectiveValue = value + 12;
      } else if (ampm === 'AM' && value === 12) { // 12 AM -> 00 en 24h
        effectiveValue = 0;
      } else if (ampm === 'PM' && value === 12) { // 12 PM -> 12 en 24h
        effectiveValue = 12;
      }
    }

    // Validar con minHour/maxHour en formato 24h
    if (effectiveValue < minHour) effectiveValue = minHour;
    if (effectiveValue > maxHour) effectiveValue = maxHour;

    setSelectedHour(effectiveValue);
    updateDisplayTime(effectiveValue, selectedMinute);
  };

  // Manejo de entrada manual para minutos
  const handleMinuteInput = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;

    // Ajustar a múltiplos del minuteStep y al rango (0-59)
    let adjustedValue = Math.round(value / minuteStep) * minuteStep;
    if (adjustedValue < 0) adjustedValue = 0;
    if (adjustedValue >= 60) adjustedValue = 0; // O 59 si prefieres no volver a 0

    setSelectedMinute(adjustedValue);
    updateDisplayTime(selectedHour, adjustedValue);
  };


  const handleApply = () => {
    const newDate = new Date();
    newDate.setHours(selectedHour);
    newDate.setMinutes(selectedMinute);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    if (onChange) {
      onChange(newDate);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    // Opcional: restablecer a la hora original antes de abrir si se cancela
    // updateDisplayTime(initialHour, initialMinute);
  };

  const formatTimeForInput = () => {
    let h = selectedHour;
    if (format === '12h') {
      h = selectedHour % 12;
      if (h === 0) h = 12; // 00:00 (medianoche) es 12 AM, 12:00 (mediodía) es 12 PM
    }
    const m = String(selectedMinute).padStart(2, '0');
    return `${String(h).padStart(2, '0')}:${m}${format === '12h' ? ` ${ampm}` : ''}`;
  };

  return (
    <div className="time-picker-container" ref={wrapperRef}>
      <label className="time-picker-label">{label}</label>
      <div className="time-picker-input-wrapper" onClick={() => setIsOpen(true)}>
        <input
          type="text"
          className="time-picker-input"
          value={formatTimeForInput()}
          readOnly
        />
        <span className="time-picker-icon">&#x231A;</span>
      </div>

      {isOpen && (
        <div className="time-picker-dropdown">
          <div className="time-picker-selector-row">
            {/* Hour Selector */}
            <div className="time-picker-selector">
              <button className="time-picker-btn" onClick={() => handleHourChange('increment')}>+</button>
              <input
                type="number"
                className="time-picker-display-input"
                value={displayHour} // Usar displayHour para el input
                onChange={handleHourInput}
                min={format === '12h' ? 1 : minHour} // Mínimo 1 para 12h
                max={format === '12h' ? 12 : maxHour} // Máximo 12 para 12h
                aria-label="Hora"
              />
              <button className="time-picker-btn" onClick={() => handleHourChange('decrement')}>-</button>
            </div>

            <span className="time-picker-separator">:</span>

            {/* Minute Selector */}
            <div className="time-picker-selector">
              <button className="time-picker-btn" onClick={() => handleMinuteChange('increment')}>+</button>
              <input
                type="number"
                className="time-picker-display-input"
                value={String(selectedMinute).padStart(2, '0')}
                onChange={handleMinuteInput}
                min="0"
                max="59"
                step={minuteStep}
                aria-label="Minutos"
              />
              <button className="time-picker-btn" onClick={() => handleMinuteChange('decrement')}>-</button>
            </div>

            {/* AM/PM Toggle for 12h format */}
            {format === '12h' && (
              <div className="time-picker-selector ampm-selector">
                <button className="time-picker-ampm-btn" onClick={handleAmpmChange}>
                  {ampm === 'AM' ? 'PM' : 'AM'}
                </button>
                <span className="time-picker-ampm-display">{ampm}</span>
                <button className="time-picker-ampm-btn" onClick={handleAmpmChange}>
                  {ampm === 'AM' ? 'PM' : 'AM'}
                </button>
              </div>
            )}
          </div>

          <div className="time-picker-actions">
            <button className="time-picker-action-btn cancel" onClick={handleCancel}>Cancelar</button>
            <button className="time-picker-action-btn apply" onClick={handleApply}>Seleccionar</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Validación de PropTypes
TimePicker.propTypes = {
  label: PropTypes.string,
  initialTime: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string
  ]),
  onChange: PropTypes.func,
  minuteStep: PropTypes.number,
  minHour: PropTypes.number,
  maxHour: PropTypes.number,
  format: PropTypes.oneOf(['12h', '24h']) // Valida que sea '12h' o '24h'
};

export default TimePicker;