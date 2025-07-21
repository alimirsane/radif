import { WeeklyCalendar } from "@kit/calendar/weekly";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { useMemo } from "react";

interface WeeklyCalendarLayoutProps {
  onDateChange?: (date: string) => void;
}

export const WeeklyCalendarLayout = (props: WeeklyCalendarLayoutProps) => {
  const reservedSessions = useMemo(() => {
    return [
      { date: "۱۴۰۳/۰۳/۰۱", session: 4 },
      { date: "۱۴۰۳/۰۲/۰۲", session: 7 },
      { date: "۱۴۰۳/۰۲/۰۳", session: 1 },
    ];
  }, []);

  const startTime = useMemo(() => {
    return "8:00";
  }, []);

  const sessionDuration = useMemo(() => {
    return 30;
  }, []);

  return (
    <>
      <WeeklyCalendar
        reservedSessions={reservedSessions}
        sessionLength={sessionDuration}
        workingHours={8}
        startTime={startTime}
        calendarCurrentWeek={1}
        placeholder={"انتخاب تاریخ هفته‌ای"}
        onDateChange={() => {}}
        holder={(date, time) => (
          <div>
            <Button>انتخاب تاریخ</Button>
            {`تاریخ: ${date}`}
            {`ساعت: ${time.startTime} - ${time.endTime}`}
          </div>
        )}
      >
        {(date, time, isReserved) => (
          <Card
            coverage={!isReserved}
            className={`${isReserved ? "bg-success bg-opacity-20" : "cursor-pointer bg-background-paper"} px-2 py-3 text-[13px]`}
            dir="ltr"
          >
            {`${time.startTime} - ${time.endTime}`}
            <p className="pt-1 font-bold">{isReserved ? "رزرو شده" : "---"}</p>
          </Card>
        )}
      </WeeklyCalendar>
    </>
  );
};
