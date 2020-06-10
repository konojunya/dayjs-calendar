import * as React from "react";
import dayjs from "dayjs";

const weekdays = "月_火_水_木_金_土_日".split("_");

export function range(start: number, end?: number): number[] {
  const s = end != null ? start : 0;
  const e = end != null ? end : start;
  const dicrection = s < e ? 1 : -1;
  const length = Math.abs(e - s);
  const result = Array(length);

  for (let i = 0; i < length; i += 1) {
    result[i] = s + i * dicrection;
  }

  return result;
}

function sliceByNumber(array: any[], number: number) {
  const length = Math.ceil(array.length / number);
  return new Array(length)
    .fill(null)
    .map((_, i) => array.slice(i * number, (i + 1) * number));
}

function createCalendarArray(lastDays: number, now: Date) {
  const today = dayjs(now);
  const end = today.endOf("month");
  const endDays = end.date();
  const month = range(endDays).map((i) => i + 1);

  const total = [
    ...range(lastDays).fill(null),
    ...month,
    ...range(Math.ceil(month.length / 7)).fill(null),
  ];

  return sliceByNumber(total, 7);
}

export type Props = {
  now: Date;
};

export const Calendar: React.FC<Props> = ({ now }) => {
  const today = dayjs();
  const start = today.startOf("month");
  const startWeekday = start.get("day");

  const calendar = createCalendarArray(startWeekday - 1, now);

  return (
    <table>
      <caption>
        {today.format("YYYY")}年 {today.format("M")}月
      </caption>
      <thead>
        <tr>
          {weekdays.map((weekday) => (
            <th key={weekday}>{weekday}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {calendar.map((week) => (
          <tr key={week.join("_")}>
            {week.map((day, index) => {
              if (day == null) {
                return <td key={index}></td>;
              }

              return <td key={index}>{day}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
