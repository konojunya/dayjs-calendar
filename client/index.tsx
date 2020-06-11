import * as React from "react";
import { render } from "react-dom";
import { Calendar } from "../components/Calendar/Calendar";
import dayjs from "dayjs";

const App = () => {
  const [date, setDate] = React.useState(dayjs());

  return (
    <>
      <button onClick={() => setDate(date.add(-1, "month"))}>先月</button>
      <button onClick={() => setDate(date.add(1, "month"))}>来月</button>
      <Calendar now={date.toDate()} />
    </>
  );
};

render(<App />, document.getElementById("app"));
