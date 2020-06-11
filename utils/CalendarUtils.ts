import dayjs, { Dayjs } from "dayjs";
import { range, sliceByNumber } from "./ArrayUtils";

export type Data = {
  startDate: string;
  endDate: string;
  duration: number;
  title: string;
};

export type ScheduleItem = {
  startDate: Dayjs;
  endDate: Dayjs;
  duration: number;
  title: string;
};

export type Schedules = {
  [date: string]: ScheduleItem[];
};

export type SchedledCalendar = ([string, ScheduleItem[]] | null)[][];

export function getDaysOfMonth(now: Date): number[] {
  const today = dayjs(now);
  const end = today.endOf("month");
  const endDays = end.date();

  return range(endDays).map((i) => i + 1);
}

export function createCalendar(
  now: Date,
  scheduledMonth: Schedules
): SchedledCalendar {
  const today = dayjs(now);
  const start = today.startOf("month");
  const startWeekday = start.get("day");
  const month = Object.entries(scheduledMonth);

  const total = [
    ...(range(startWeekday - 1).fill(null) as null[]),
    ...month,
    ...(range(Math.ceil(month.length / 7)).fill(null) as null[]),
  ];

  return sliceByNumber(total, 7);
}

export function formatCalendarSchedule(
  items: Data[],
  days: number[],
  month: string,
  year: string
): Schedules {
  const formated = items.map((item) => ({
    ...item,
    startDate: dayjs(item.startDate),
    endDate: dayjs(item.endDate),
  }));

  const schedules = days.reduce((pre, cur) => {
    const item = formated.filter((item) => {
      const current = dayjs(`${year}/${month}/${cur}`);

      return (
        current.isSame(item.startDate) ||
        current.isSame(item.endDate) ||
        (current.isBefore(item.endDate) && current.isAfter(item.startDate))
      );
    });

    return {
      ...pre,
      [cur]: pre[cur] != null ? [...pre[cur], ...item] : item,
    };
  }, {});

  return schedules;
}
