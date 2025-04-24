import React, { useState } from 'react';
import { format, isSameDay, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from '../utils/dateUtils';
import { Calendar as CalendarIcon, Pin } from 'lucide-react';

const Calendar = ({ dates, onDateClick, selectedDate, meetings, compact }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const hasMeeting = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return meetings && meetings[dateKey];
  };

  const isWeeklyDate = (date) => {
    return dates.some(weeklyDate => isSameDay(weeklyDate, date));
  };

  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const days = [];
    let currentDate = calendarStart;

    while (currentDate <= calendarEnd) {
      days.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    return days;
  };

  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  return (
    <div className={`bg-gray-50 rounded-xl shadow-md p-4 ${compact ? 'max-w-2xl mx-[20px]' : 'w-full max-w-2xl mx-auto'}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={goToPreviousMonth} className="text-xs text-blue-500 hover:underline">&lt; Prev</button>
        <div className="flex items-center justify-center">
          <CalendarIcon className="mr-2 text-blue-400" size={20} />
          <h2 className="text-sm font-semibold text-gray-500">
            {format(currentMonth, 'MM-MM-yyyy')}
          </h2>
        </div>
        <button onClick={goToNextMonth} className="text-xs text-blue-500 hover:underline">Next &gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {generateMonthDays().map((date, index) => {
          const isSelected = selectedDate && isSameDay(selectedDate, date);
          const isWeekly = isWeeklyDate(date);
          const hasScheduledMeeting = hasMeeting(date);
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

          return (
            <div
              key={index}
              onClick={() => onDateClick(date)}
              className={`
                relative p-2 rounded-md transition-all duration-200 text-center
                ${isCurrentMonth ? 'hover:bg-gray-100' : 'opacity-40'}
                ${isSelected ? 'bg-blue-100 text-black' : 'text-black'}
                cursor-pointer
              `}
            >
              <div className="text-sm font-normal">
                {date.getDate()}
              </div>

              {hasScheduledMeeting && (
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 mx-auto"></div>
              )}

              {isWeekly && (
                <div className="absolute top-0 right-0 text-blue-400">
                  <Pin size={10} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!compact && (
        <div className="mt-3 flex items-center justify-center space-x-3">
          <div className="flex items-center text-xs text-gray-400">
            <Pin size={12} className="text-blue-400 mr-1" />
            Weekly Pinned Date
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            Scheduled Meeting
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
