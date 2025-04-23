// Date utility functions
export const format = (date, formatStr) => {
    if (!date) return '';
    
    const d = new Date(date);
    
    const formats = {
      'yyyy': d.getFullYear(),
      'MM': (d.getMonth() + 1).toString().padStart(2, '0'),
      'M': d.getMonth() + 1,
      'dd': d.getDate().toString().padStart(2, '0'),
      'd': d.getDate(),
      'EEEE': getWeekdayName(d.getDay()),
      'EEE': getWeekdayName(d.getDay()).substring(0, 3),
      'MMMM': getMonthName(d.getMonth()),
      'MMM': getMonthName(d.getMonth()).substring(0, 3),
      'HH': d.getHours().toString().padStart(2, '0'),
      'mm': d.getMinutes().toString().padStart(2, '0'),
      'ss': d.getSeconds().toString().padStart(2, '0')
    };
    
    return formatStr.replace(/yyyy|MM|M|dd|d|EEEE|EEE|MMMM|MMM|HH|mm|ss/g, match => formats[match]);
  };
  
  export const parseDate = (dateStr) => {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    if (!isNaN(date)) return date;
    
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
    
    return null;
  };
  
  export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };
  
  export const startOfMonth = (date) => {
    const result = new Date(date);
    result.setDate(1);
    return result;
  };
  
  export const endOfMonth = (date) => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    return result;
  };
  
  export const startOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
  };
  
  export const endOfWeek = (date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() + (6 - day));
    return result;
  };
  
  export const isWithinInterval = (date, start, end) => {
    const d = new Date(date);
    return d >= start && d <= end;
  };
  
  const getWeekdayName = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
  };
  
  const getMonthName = (month) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };