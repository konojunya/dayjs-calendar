import * as React from "react";
import { render } from "react-dom";
import { Calendar } from "../components/Calendar/Calendar";
import dayjs from "dayjs";
import { createCalendarSchedules } from "../utils/CalendarUtils";

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

const Schedule: React.FC<{ title: string }> = ({ title }) => {
  return <p>{title}</p>;
};

const App = () => {
  const [date, setDate] = React.useState(dayjs());

  const schedules = createCalendarSchedules(data, date.toDate());

  return (
    <>
      <button onClick={() => setDate(date.add(-1, "month"))}>先月</button>
      <button onClick={() => setDate(date.add(1, "month"))}>来月</button>
      <Calendar
        now={date.toDate()}
        schedules={schedules}
        component={Schedule}
      />
    </>
  );
};

render(<App />, document.getElementById("app"));
