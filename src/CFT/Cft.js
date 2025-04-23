import React, { useState } from 'react';
import Calendar from './Calender';
import MeetingDetails from './MeetingDetails';
import DateSelector from './DateSelector';
import { addDays, format } from '../utils/dateUtils';

const CFTMeetingManager = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [initialDate, setInitialDate] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [meetings, setMeetings] = useState({});

  const getWeeklyDates = () => {
    if (!initialDate) return [];
    return Array.from({ length: 6 }, (_, i) => addDays(initialDate, i * 7));
  };

  const handleInitialDateSelect = (date) => {
    setInitialDate(date);
    setSelectedDate(null);
    setShowDetails(false);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowDetails(true);
  };

  const handleSave = (meetingData) => {
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    setMeetings({
      ...meetings,
      [dateKey]: meetingData,
    });
    setShowDetails(false);
  };

  const getMeetingForDate = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return meetings[dateKey] || null;
  };

  return (
    <div className="min-h-screen  text-gray-100 py-5 px-4 md:px-10">
      <h1 className="text-2xl font-semibold text-center text-gray-500 mb-5 tracking-tight">
        CFT Meeting 
      </h1>

      {!initialDate && (
        <div className="flex flex-col items-center justify-center p-0  max-w-lg mx-auto">
          <p className="text-sm mb-3 text-gray-500">Select the starting date for your CFT meetings</p>
          <DateSelector onDateSelect={handleInitialDateSelect} />
        </div>
      )}

      {initialDate && !showDetails && (
        <div className="flex flex-col items-center">
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-400">Meeting series starting from:</p>
            <div className="inline-block  text-gray-500 px-4 py-2 rounded-md mt-1 text-sm font-medium">
              {format(initialDate, 'MMMM d, yyyy')}
            </div>
            <button
              onClick={() => setInitialDate(null)}
              className="ml-4 text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Change
            </button>
          </div>
          <Calendar
            dates={getWeeklyDates()}
            onDateClick={handleDateClick}
            meetings={meetings}
          />
        </div>
      )}

      {showDetails && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
          <div className="md:col-span-1">
            <Calendar
              dates={getWeeklyDates()}
              onDateClick={handleDateClick}
              selectedDate={selectedDate}
              meetings={meetings}
              compact={true}
            />
          </div>
          <div className="md:col-span-2">
            <MeetingDetails
              date={selectedDate}
              meeting={getMeetingForDate(selectedDate)}
              onSave={handleSave}
              onCancel={() => setShowDetails(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CFTMeetingManager;