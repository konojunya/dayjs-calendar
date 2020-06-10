import * as React from "react";
import { render } from "react-dom";
import { Calendar } from "../components/Calendar/Calendar";
import dayjs from "dayjs";

const App = () => {
  const now = dayjs();

  return <Calendar now={now.toDate()} />;
};

render(<App />, document.getElementById("app"));
