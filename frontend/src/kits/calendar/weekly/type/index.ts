import { ReactElement } from "react";
export interface Time {
  startTime: string;
  endTime: string;
}
export interface WeeklyCalendarType {
  children: (
    date: string,
    time: Time,
    isReserved: boolean,
  ) => React.ReactElement;
  workingHours: number;
  sessionLength: number;
  calendarCurrentWeek: number;
  placeholder: string;
  onDateChange?: (date: string, time: Time) => void;
  holder?: (date: string, time: Time) => ReactElement;
  reservedSessions: { date: string; session: number }[];
  startTime: string;
}
