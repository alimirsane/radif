// persianDateConverter.js

function ToPersianDate(inputDate: string) {
  const gregorianDate = new Date(inputDate);

  // Calculate Persian (Jalali) date
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth() + 1;
  const gregorianDay = gregorianDate.getDate();

  const gregorianDaysInMonth = [
    31,
    28 + isLeapGregorian(gregorianYear),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const persianDaysInMonth = [
    31,
    31,
    31,
    31,
    31,
    31,
    30,
    30,
    30,
    30,
    30,
    29 + isLeapPersian(gregorianYear),
  ];

  let persianYear = gregorianYear - 621;
  let persianMonth = 0;
  let persianDay = 0;
  let passedDays = 0;

  for (let i = 0; i < persianDaysInMonth.length; i++) {
    if (gregorianMonth === i + 1) {
      persianMonth = i + 1;
      persianDay = Math.min(persianDaysInMonth[i], gregorianDay);
      break;
    }
    passedDays += gregorianDaysInMonth[i];
  }

  if (persianMonth === 0) {
    persianYear--;
    persianMonth = 12;
    persianDay = persianDaysInMonth[11];
  }

  persianDay += Math.max(
    0,
    gregorianDay - gregorianDaysInMonth[gregorianMonth - 1],
  );

  return `${persianYear}/${persianMonth.toString().padStart(2, "0")}/${persianDay.toString().padStart(2, "0")}`;
}

function isLeapGregorian(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 1 : 0;
}

function isLeapPersian(year: number): number {
  const result = (year - (year > 0 ? 474 : 473)) % 2820;
  return result === 682 || result === 683 || result === 681 ? 1 : 0;
}

export { ToPersianDate };
