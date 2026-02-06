import properties from "./properties";

interface DateObj {
  monthIndex: number;
  date: number;
}

class BusinessDay {
  private japaneseHolidayCalendar: GoogleAppsScript.Calendar.Calendar;

  constructor(private newYearHolidays: DateObj[]) {
    this.japaneseHolidayCalendar = CalendarApp.getCalendarById(
      properties.GOOGLE_JAPANESE_HOLIDAY_CALENDAR_ID
    );
  }

  /**
   * 入力した月の初日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 月初日
   */
  private getFirstDateOfMonth(year: number, monthIndex: number): Date {
    const d = new Date(year, monthIndex, 1, 0);
    return d;
  }

  /**
   * 入力した日付の月の末日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 月末日
   */
  private getLastDateOfMonth(year: number, monthIndex: number): Date {
    const d = new Date(year, monthIndex + 1, 0, 0);
    return d;
  }

  /**
   * 入力した年の初日を返す
   * @param year 年
   * @return 年初日
   */
  private getFirstDateOfYear(year: number): Date {
    const d = new Date(year, 0, 1, 0);
    return d;
  }

  /**
   * 入力した年の末日を返す
   * @param year 年
   * @return 年末日
   */
  private getLastDateOfYear(year: number): Date {
    const d = new Date(year + 1, 0, 0, 0);
    return d;
  }

  /**
   * 入力した日付が平日かどうかを返す
   * @param date 判定したい日付
   * @return 平日であればtrue、土日であればfalse
   */
  public isWeekDay(date: Date): boolean {
    return date.getDay() !== 0 && date.getDay() !== 6;
  }

  /**
   * 入力した日付が日本の祝日かどうかを返す
   */
  public isJapaneseHoliday(date: Date): boolean {
    const japaneseHolidayEvents = this.japaneseHolidayCalendar.getEvents(
      this.getFirstDateOfYear(date.getFullYear()),
      this.getLastDateOfYear(date.getFullYear())
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
  }

  /**
   * 入力した日付が年末年始休暇かどうかを返す
   */
  public isNewYearHoliday(date: Date): boolean {
    return (
      this.newYearHolidays.filter(
        (d) => d.monthIndex === date.getMonth() && d.date === date.getDate()
      ).length > 0
    );
  }

  /**
   * 入力した日付が営業日かどうかを返す
   * @param date 判定したい日付
   * @return 営業日であればtrue、そうでなければfalse
   */
  public isBusinessDay(date: Date): boolean {
    return (
      this.isWeekDay(date) &&
      !this.isJapaneseHoliday(date) &&
      !this.isNewYearHoliday(date)
    );
  }

  /**
   * 入力した月の最初の営業日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 最初の営業日
   */
  public getFirstBusinessDayOfMonth(year: number, monthIndex: number): Date {
    const date = this.getFirstDateOfMonth(year, monthIndex);
    const lastDateOfMonth = this.getLastDateOfMonth(year, monthIndex);
    for (const d of [...Array(lastDateOfMonth.getDate()).keys()]) {
      if (this.isBusinessDay(date)) {
        break;
      }
      date.setDate(d + 1);
    }
    return date;
  }

  /**
   * 入力した月の最終の営業日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 最終の営業日
   */
  public getLastBusinessDayOfMonth(year: number, monthIndex: number): Date {
    const date = this.getLastDateOfMonth(year, monthIndex);
    const lastDateOfMonth = this.getLastDateOfMonth(year, monthIndex);
    for (const d of [...Array(lastDateOfMonth.getDate()).keys()].reverse()) {
      if (this.isBusinessDay(date)) {
        break;
      }
      date.setDate(d + 1);
    }
    return date;
  }

  /**
   * 入力した月のすべての営業日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 営業日の配列
   */
  public getBusinessDaysOfMonth(year: number, monthIndex: number): Date[] {
    const dayOfMonth: Date = this.getFirstDateOfMonth(year, monthIndex);
    const lastDayOfMonth: Date = this.getLastDateOfMonth(year, monthIndex);
    const businessDaysOfMonth: Date[] = [];
    while (dayOfMonth) {
      if (this.isBusinessDay(dayOfMonth)) {
        businessDaysOfMonth.push(new Date(dayOfMonth.getTime()));
      }
      if (dayOfMonth.getDate() === lastDayOfMonth.getDate()) {
        break;
      }
      dayOfMonth.setDate(dayOfMonth.getDate() + 1);
    }
    return businessDaysOfMonth;
  }

  public static createWithDefaultNewYearHolidays(): BusinessDay {
    const defaultNewYearHolidays: DateObj[] = [
      {monthIndex: 0, date: 1},
      {monthIndex: 0, date: 2},
      {monthIndex: 0, date: 3},
    ];
    return new BusinessDay(defaultNewYearHolidays);
  }
}

export {BusinessDay};
