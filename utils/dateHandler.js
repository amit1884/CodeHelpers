// https://www.xul.fr/javascript/date.php

export function suffixedDay(day) {
  let suffix;
  if (day > 3 && day < 21) {
    suffix = 'th';
  } else {
    switch (day % 10) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
  }
  return `${day}${suffix}`;
}

export function getDay(date) {
  // date format = 2020-02-05
  const d = new Date(date);
  return d.getDate();
}

export function getSuffixedDate(date) {
  const d = new Date(date);
  return suffixedDay(d.getDate());
}

export function getFullMonthName(date) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const d = new Date(date);
  return monthNames[d.getMonth()];
}

export function getShortMonthName(date) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  const d = new Date(date);
  return monthNames[d.getMonth()];
}

// output : "Jan 30, 2021"
export function humanDate(date, fallback = '') {
  const _date = new Date(date?.split(' ')[0]);

  if (_date.toString() === 'Invalid Date') return fallback;

  return _date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// output : 12 Jan 2021
export function humanUnderstandableDate(value, showComma = false, showFullYear = false) {
  const d = new Date(value);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  let date = d.getDate();
  date = date < 10 ? `0${date}` : date;
  const month = monthNames[d.getMonth()];
  let year = d.getFullYear().toString();
  year = showFullYear ? year : year.slice(2, 4);
  return `${date} ${month} ${showComma ? '`' : ''}${year}`;
}

export function datePickerDate(value) {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function getMonthDateYear(value) {
  // - to / bcz of saffari
  //https://stackoverflow.com/questions/4310953/invalid-date-in-safari
  value = value?.replace(/-/g, "/");
  const d = new Date(value);
  return `${getFullMonthName(value)} ${d.getDate()}, ${d.getFullYear()}`;
}

export function getDateForAdmissionCard(value) {
  const d = new Date(value);
  const month = getFullMonthName(value);
  let date = d.getDate();
  date = suffixedDay(date);
  const year = d.getFullYear();
  return `${month} ${date}, ${year}`;
}
export function getTime(value, is12HourFormat) {
  const date = new Date(value);
  const minutes = date.getMinutes();
  let hour = date.getHours();
  let suffix = 'AM';

  if (is12HourFormat && hour > 12) {
    hour -= 12;
    suffix = 'PM';
  }

  return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}${is12HourFormat ? suffix : ''}`;
}

export function examModalDate(value) {
  const d = new Date(value);
  let date = d.getDate();
  date = date < 10 ? `0${date}` : date;
  const month = getFullMonthName(value);
  const year = d.getFullYear().toString();
  return ` ${month} ${date}, ${year}`;
}

export function mmddyyyyFormat(date) {
  const d = new Date(date);
  return `${getFullMonthName(d)} ${d.getDate()}, ${d.getFullYear()}`;
}
export function getDateForAdmissionCollegeCard(value) {
  const d = new Date(value);
  let date = d.getDate();
  date = date < 10 ? `0${date}` : date;
  const month = getFullMonthName(value);
  const year = d.getFullYear().toString();
  return `${date}, ${month} ${year}`;
}

export function getYear(value) {
  const d = new Date(value);
  const year = d.getFullYear().toString();
  return `${year}`;
}

export function yyyymmddFormat(date) {
  const d = new Date(date);
  // changing Month 9 to 09
  const month = d.getMonth() + 1;
  let monthStr = month.toString();
  if (month < 10) {
    monthStr = `0${monthStr}`;
  }
  // Changing date 1 -> 01
  let dateVal = d.getDate();
  if (dateVal < 10) {
    dateVal = `0${dateVal}`;
  }
  return `${d.getFullYear()}-${monthStr}-${dateVal}`;
}

export function getNextYearLastDate() {
  const nextYear = (new Date()).getFullYear() + 1;
  return new Date(`${nextYear}-12-31`);
}

export function getFirstOfCurrentMonth() {
  const date = new Date();
  date.setDate(1);
  return date;
}
