import * as React from "react";
import dayjs from "dayjs";
import {
  createCalendar,
  formatCalendarSchedule,
  getDaysOfMonth,
} from "../../utils/CalendarUtils";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  table-layout: fixed;
`;

const Caption = styled.caption`
  font-weight: bold;
  font-size: 0.87rem;
  margin-bottom: 16px;
`;

const Th = styled.th`
  padding: 4px 0;
  border-top: 1px solid var(--table-border-color);
  border-bottom: 1px solid var(--table-border-color);
  text-align: left;
  color: var(--table-text-color);
  font-size: 0.75rem;

  &:not(:first-child) {
    border-left: 1px solid var(--table-border-color);
  }
`;

const Td = styled.td`
  text-align: left;
  border-top: 1px solid var(--table-border-color);
  vertical-align: top;
  color: var(--table-text-color);
  font-size: 0.75rem;

  &:not(:first-child) {
    border-left: 1px solid var(--table-border-color);
  }
`;

const Tr = styled.tr<{ firstWeek: boolean; maxSchedule: number }>`
  height: ${({ maxSchedule }) =>
    maxSchedule !== 0 ? maxSchedule * 58 + 40 - 8 : 80}px;

  > td {
    border-top: ${({ firstWeek }) =>
      firstWeek ? "none" : "1px solid var(--table-border-color)"};
  }
`;

const Day = styled.h2`
  padding: 8px 0;
  font-weight: normal;
  font-size: 1rem;
`;

const ScheduleWrapper = styled.div`
  position: relative;
`;

const Schedule = styled.div<{
  period: number;
  stackCount: number;
  show: boolean;
}>`
  position: absolute;
  top: ${({ stackCount }) => stackCount * 58}px;
  width: ${({ period }) => period * 100}%;
  height: 50px;
  background: #ededed;
  color: #d45e00;
  opacity: ${({ show }) => (show ? "1" : "0")};
`;

const Title = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const weekdays = "月_火_水_木_金_土_日".split("_");

const data = [
  {
    startDate: "20200601",
    endDate: "20200602",
    duration: 2,
    title: "スケジュール1",
  },
  {
    startDate: "20200602",
    endDate: "20200603",
    duration: 2,
    title: "スケジュール2",
  },
  {
    startDate: "20200606",
    endDate: "20200609",
    duration: 4,
    title: "すごい長い予定の名前がつきます",
  },
  {
    startDate: "20200630",
    endDate: "20200702",
    duration: 3,
    title: "月を跨ぎます",
  },
];

export type Props = {
  now: Date;
};

export const Calendar: React.FC<Props> = ({ now }) => {
  const today = dayjs(now);
  const year = today.format("YYYY");
  const month = today.format("M");
  const monthLastDate = today.endOf("month").date();
  const monthFirstDate = today.startOf("month").date();

  const daysOfMonth = getDaysOfMonth(now);
  const schedules = formatCalendarSchedule(data, daysOfMonth, month, year);

  const calendar = createCalendar(now, schedules);

  return (
    <Wrapper aria-label="Calendar" tabIndex={-1}>
      <Table role="grid">
        <Caption>
          {year}年 {month}月
        </Caption>
        <thead>
          <tr>
            {weekdays.map((weekday) => (
              <Th key={weekday} title={`${weekday}曜日`}>
                {weekday}
              </Th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calendar.map((week, index) => {
            const weekStart = week[0];
            const start = weekStart != null ? weekStart[0] : monthFirstDate;
            const weekStartDay = dayjs(`${year}/${month}/${start}`);
            const last = week[week.length - 1];
            const end = last != null ? last[0] : monthLastDate;
            const weekEndDay = dayjs(`${year}/${month}/${end}`);

            return (
              <Tr
                key={week.join("_")}
                firstWeek={index === 0}
                maxSchedule={Math.max(
                  ...week.map((i) => (i != null ? i[1].length : 0))
                )}
              >
                {week.map((day, index) => {
                  if (day == null) {
                    return <Td key={index}></Td>;
                  }

                  const [date, schedules] = day;
                  const currentDay = dayjs(`${year}/${month}/${date}`);

                  return (
                    <Td key={index}>
                      <Day>{date}</Day>

                      <ScheduleWrapper role="presentation">
                        {schedules.map((schedule, index) => {
                          // currentDayがscheduleのstart~endにはいってるか
                          const include =
                            schedule.startDate.isSame(currentDay) ||
                            schedule.endDate.isSame(currentDay) ||
                            (schedule.startDate.isBefore(currentDay) &&
                              schedule.endDate.isAfter(currentDay));

                          // 週末を跨がれた予定か
                          if (schedule.startDate.isBefore(weekStartDay)) {
                            const remaining =
                              currentDay
                                .add(-1, "day")
                                .diff(schedule.startDate, "day") + 1;
                            const diff = schedule.duration - remaining;
                            const show = currentDay.isSame(weekStartDay);

                            return (
                              <Schedule
                                show={show}
                                period={show ? diff : 1}
                                stackCount={index}
                                key={schedule.title}
                                role="button"
                                tabIndex={show ? 0 : -1}
                                aria-hidden={!show}
                              >
                                <Title>{schedule.title}</Title>
                              </Schedule>
                            );
                          }

                          // 週末を跨ぐ場合
                          if (
                            schedule.startDate.isSame(currentDay) &&
                            schedule.endDate.isAfter(weekEndDay)
                          ) {
                            const diff = schedule.endDate.diff(
                              weekEndDay,
                              "day"
                            );
                            const show = schedule.startDate.isSame(currentDay);

                            return (
                              <Schedule
                                show={show}
                                period={show ? schedule.duration - diff : 1}
                                stackCount={index}
                                key={schedule.title}
                                role="button"
                                tabIndex={show ? 0 : -1}
                                aria-hidden={!show}
                              >
                                <Title>{schedule.title}</Title>
                              </Schedule>
                            );
                          }

                          if (include) {
                            const show = schedule.startDate.isSame(currentDay);

                            return (
                              <Schedule
                                show={show}
                                period={show ? schedule.duration : 1}
                                stackCount={index}
                                key={schedule.title}
                                role="button"
                                tabIndex={show ? 0 : -1}
                                aria-hidden={!show}
                              >
                                <Title>{schedule.title}</Title>
                              </Schedule>
                            );
                          }
                        })}
                      </ScheduleWrapper>
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </tbody>
      </Table>
    </Wrapper>
  );
};
