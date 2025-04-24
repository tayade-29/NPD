import React, { useState } from 'react';
import { format, parseDate, isSameDay, addDays } from '../utils/dateUtils';
import { Calendar as CalendarIcon, Pin } from 'lucide-react';

const DateSelector = ({ onDateSelect }) => {
  const [date, setDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weeklyPins, setWeeklyPins] = useState([]);

  const handleInputChange = (e) => {
    setDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDate = parseDate(date);
    if (selectedDate) {
      onDateSelect(selectedDate);
      const newPins = Array.from({ length: 10 }, (_, i) => addDays(selectedDate, i * 7));
      setWeeklyPins(newPins);
    }
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleDateClick = (day) => {
    const newDate = format(day, 'yyyy-MM-dd');
    setDate(newDate);
    setShowCalendar(false);
    const selectedDate = parseDate(newDate);
    const newPins = Array.from({ length: 10 }, (_, i) => addDays(selectedDate, i * 7));
    setWeeklyPins(newPins);
    onDateSelect(selectedDate);
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const renderCalendarDays = () => {
    const days = [];
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const startDay = monthStart.getDay();
    for (let i = 0; i < startDay; i++) {
      const prevMonthDay = new Date(monthStart);
      prevMonthDay.setDate(prevMonthDay.getDate() - (startDay - i));
      days.push({ date: prevMonthDay, currentMonth: false });
    }

    for (let day = 1; day <= monthEnd.getDate(); day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      days.push({ date, currentMonth: true });
    }

    const lastWeekDay = monthEnd.getDay();
    if (lastWeekDay < 6) {
      for (let i = 1; i <= 6 - lastWeekDay; i++) {
        const nextMonthDay = new Date(monthEnd);
        nextMonthDay.setDate(nextMonthDay.getDate() + i);
        days.push({ date: nextMonthDay, currentMonth: false });
      }
    }

    return days;
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={date}
            onChange={handleInputChange}
            placeholder="YYYY-MM-DD"
            className="w-full p-3 border border-gray-300 rounded-l-lg focus:outline-none text-gray-500 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={toggleCalendar}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <CalendarIcon size={24} />
          </button>
        </div>
        <button
          type="submit"
          className="bg-gray-600 text-white px-4 py-3 rounded-r-lg hover:bg-gray-700 transition-colors"
        >
          Select
        </button>
      </form>

      {showCalendar && (
        <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-full">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >&lt;</button>
            <h3 className="font-medium">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >&gt;</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-medium text-gray-500 text-xs py-1">
                {day}
              </div>
            ))}

            {renderCalendarDays().map((day, index) => (
              <div
                key={index}
                onClick={() => handleDateClick(day.date)}
                className={`
                  text-center p-2 cursor-pointer text-sm rounded-full relative hover:bg-blue-50
                  ${day.currentMonth ? 'text-gray-800' : 'text-gray-400'}
                  ${date === format(day.date, 'yyyy-MM-dd') ? 'bg-blue-500 text-black hover:bg-blue-600' : ''}
                `}
              >
                {day.date.getDate()}
                {weeklyPins.some(pinDate => isSameDay(pinDate, day.date)) && (
                  <Pin size={10} className="absolute top-0 right-0 text-blue-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;