import {
  isBusinessDay,
  getFirstBusinessDayOfMonth,
  getLastBusinessDayOfMonth,
  getBusinessDaysOfMonth,
} from "./functions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let global: any;

/**
 * 営業日かどうかを返す
 * @param date 判定したい日付
 * @returns 営業日の場合true、そうでない場合false
 */
global.isBusinessDay = isBusinessDay;
/**
 * 入力した月の最初の営業日を返す
 * @param year 年
 * @param monthIndex 月のインデックス（0〜11）
 * @returns 指定した月の最初の営業日
 */
global.getFirstBusinessDayOfMonth = getFirstBusinessDayOfMonth;
/**
 * 入力した月の最終の営業日を返す
 * @param year 年
 * @param monthIndex 月のインデックス（0〜11）
 * @returns 指定した月の最終の営業日
 */
global.getLastBusinessDayOfMonth = getLastBusinessDayOfMonth;
/**
 * 入力した月のすべての営業日を返す
 * @param year 年
 * @param monthIndex 月のインデックス（0〜11）
 * @returns 指定した月のすべての営業日
 */
global.getBusinessDaysOfMonth = getBusinessDaysOfMonth;
