import {BusinessDay} from "./main";

export function create(
  holidays: {monthIndex: number; date: number}[] = []
): BusinessDay {
  return BusinessDay.create(holidays);
}
