import properties from "./properties";

interface DateObj {
  monthIndex: number;
  date: number;
}

class BusinessDay {
  private japaneseHolidayCalendar: GoogleAppsScript.Calendar.Calendar;

  private constructor(private newYearHolidays: DateObj[]) {
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
   * 入力した月のすべての日付を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 日付の配列
   */
  private getAllDatesOfMonth(year: number, monthIndex: number): Date[] {
    const lastDateOfMonth: Date = this.getLastDateOfMonth(year, monthIndex);
    return [...Array(lastDateOfMonth.getDate()).keys()].map((d) => {
      return new Date(year, monthIndex, d + 1, 0);
    });
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
    const allDatesOfMonth = this.getAllDatesOfMonth(year, monthIndex);
    const firstBusinessDayOfMonth = allDatesOfMonth.find((date) =>
      this.isBusinessDay(date)
    );
    if (!firstBusinessDayOfMonth) {
      throw new Error("Not found last business day of month");
    }
    return firstBusinessDayOfMonth;
  }

  /**
   * 入力した月の最終の営業日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 最終の営業日
   */
  public getLastBusinessDayOfMonth(year: number, monthIndex: number): Date {
    const allDatesOfMonth = this.getAllDatesOfMonth(year, monthIndex);
    const lastBusinessDayOfMonth = allDatesOfMonth
      .reverse()
      .find((date) => this.isBusinessDay(date));
    if (!lastBusinessDayOfMonth) {
      throw new Error("Not found last business day of month");
    }
    return lastBusinessDayOfMonth;
  }

  /**
   * 入力した月のすべての営業日を返す
   * @param year 年
   * @param monthIndex 月のインデックス（0〜11）
   * @return 営業日の配列
   */
  public getBusinessDaysOfMonth(year: number, monthIndex: number): Date[] {
    const allDatesOfMonth = this.getAllDatesOfMonth(year, monthIndex);
    return allDatesOfMonth.filter((date) => this.isBusinessDay(date));
  }

  public static create(newYearHolidays: DateObj[]): BusinessDay {
    return new BusinessDay(newYearHolidays);
  }
}

export {BusinessDay};
