import properties from "./properties";

/**
 * 入力した月の初日を返す
 */
const getFirstDateOfMonth = (year: number, monthIndex: number): Date => {
  const d = new Date(year, monthIndex, 1, 0);
  return d;
};

/**
 * 入力した日付の月の末日を返す
 */
const getLastDateOfMonth = (year: number, monthIndex: number): Date => {
  const d = new Date(year, monthIndex + 1, 0, 0);
  return d;
};

/**
 * 入力した年の初日を返す
 */
const getFirstDateOfYear = (year: number): Date => {
  const d = new Date(year, 0, 1, 0);
  return d;
};

/**
 * 入力した年の末日を返す
 */
const getLastDateOfYear = (year: number): Date => {
  const d = new Date(year + 1, 0, 0, 0);
  return d;
};

/**
 * 入力した日付が平日かどうかを返す
 */
const isWeekDay = (date: Date): boolean => {
  return date.getDay() !== 0 && date.getDay() !== 6;
};

/**
 * 入力した日付が日本の祝日かどうかを返す
 */
const isJapaneseHoliday = (date: Date): boolean => {
  const calendarId = properties.getProperty(
    "GOOGLE_JAPANESE_HOLIDAY_CALENDAR_ID"
  );
  if (calendarId === null) {
    throw new Error("unset script properties for ID of calendar.");
  }
  const japaneseHolidayCalendar = CalendarApp.getCalendarById(calendarId);
  const japaneseHolidayEvents = japaneseHolidayCalendar.getEvents(
    getFirstDateOfYear(date.getFullYear()),
    getLastDateOfYear(date.getFullYear())
  );
  const japaneseHolidayEventDates: Date[] = japaneseHolidayEvents.map(
    (e) =>
      new Date(
        e.getStartTime().getTime() +
          (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
      )
  );
  return (
    japaneseHolidayEventDates.filter(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    ).length > 0
  );
};

/**
 * 入力した日付が年末年始休暇かどうかを返す
 */
const isNewYearHoliday = (date: Date): boolean => {
  const calendarId = properties.getProperty("GOOGLE_CALENDAR_ID");
  if (calendarId === null) {
    throw new Error("unset script properties for ID of calendar.");
  }
  const myCalendar = CalendarApp.getCalendarById(calendarId);
  const events = myCalendar.getEvents(
    getFirstDateOfYear(date.getFullYear()),
    getLastDateOfYear(date.getFullYear())
  );
  const newYearHolidayEvents = events.filter(
    (e) => e.getTitle() === "年末年始休暇"
  );
  const newYearHolidayEventDates: Date[] = newYearHolidayEvents.map(
    (e) =>
      new Date(
        e.getStartTime().getTime() +
          (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000
      )
  );
  return (
    newYearHolidayEventDates.filter(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    ).length > 0
  );
};

export const isBusinessDay = (date: Date): boolean => {
  return isWeekDay(date) && !isJapaneseHoliday(date) && !isNewYearHoliday(date);
};

/**
 * 入力した月の最初の営業日を返す
 */
export const getFirstBusinessDayOfMonth = (
  year: number,
  monthIndex: number
): Date => {
  const date = getFirstDateOfMonth(year, monthIndex);
  const lastDayOfMonth = getLastDateOfMonth(year, monthIndex);
  for (const d of [...Array(lastDayOfMonth.getDate()).keys()]) {
    if (isBusinessDay(date)) {
      break;
    }
    date.setDate(d + 1);
  }
  return date;
};

/**
 * 入力した月の最終の営業日を返す
 */
export const getLastBusinessDayOfMonth = (
  year: number,
  monthIndex: number
): Date => {
  const date = getLastDateOfMonth(year, monthIndex);
  const lastDayOfMonth = getLastDateOfMonth(year, monthIndex);
  for (const d of [...Array(lastDayOfMonth.getDate()).keys()].reverse()) {
    if (isBusinessDay(date)) {
      break;
    }
    date.setDate(d + 1);
  }
  return date;
};

/**
 * 入力した月のすべての営業日を返す
 */
export const getBusinessDaysOfMonth = (
  year: number,
  monthIndex: number
): Date[] => {
  const dayOfMonth: Date = getFirstDateOfMonth(year, monthIndex);
  const lastDayOfMonth: Date = getLastDateOfMonth(year, monthIndex);
  const businessDaysOfMonth: Date[] = [];
  while (dayOfMonth) {
    if (isBusinessDay(dayOfMonth)) {
      businessDaysOfMonth.push(new Date(dayOfMonth.getTime()));
    }
    if (dayOfMonth.getDate() === lastDayOfMonth.getDate()) {
      break;
    }
    dayOfMonth.setDate(dayOfMonth.getDate() + 1);
  }
  return businessDaysOfMonth;
};
