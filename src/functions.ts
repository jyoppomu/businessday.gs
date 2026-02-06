import {BusinessDay} from "./main";

export function create(
  holidays: {monthIndex: number; date: number}[]
): BusinessDay {
  return new BusinessDay(holidays);
}
