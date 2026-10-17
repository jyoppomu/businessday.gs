import {BusinessDay} from "./main.ts";

export function create(
  holidays: {monthIndex: number; date: number}[] = []
): BusinessDay {
  return BusinessDay.create(holidays);
}
