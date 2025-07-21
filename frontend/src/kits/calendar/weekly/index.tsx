import React, { useCallback, useMemo, useState } from "react";
import DateObject from "react-date-object";
import { PersianCalendar } from "@kit/calendar";
import { DateHandler } from "@utils/date-handler";
import { Time, WeeklyCalendarType } from "./type";
import { twMerge } from "tailwind-merge";

export const WeeklyCalendar = ({
                                 children,
                                 workingHours,
                                 sessionLength,
                                 calendarCurrentWeek,
                                 placeholder,
                                 onDateChange,
                                 holder,
                                 reservedSessions,
                                 startTime
                               }: WeeklyCalendarType) => {
  const [currentWeek, setCurrentWeek] = useState(calendarCurrentWeek);
  const [selectedSession, setSelectedSession] = useState<Time>({
    startTime: "",
    endTime: ""
  });

  const _startTime = useCallback(
    (index: number) => {
      return calculateSessionTime(startTime, sessionLength * index);
    },
    [sessionLength, startTime]
  );

  const _endTime = useCallback(
    (index: number) => {
      return calculateSessionTime(startTime, sessionLength * (index + 1));
    },
    [sessionLength, startTime]
  );

  const _time = useCallback(
    (index: number) => {
      return {
        startTime: _startTime(index),
        endTime: _endTime(index)
      };
    },
    [_endTime, _startTime]
  );

  const _isReserved = useCallback((index: number, date: string) => {
    for (const session of reservedSessions) {
      if (session.date === date && session.session === index) {
        return true; // If reserved session found
      }
    }
    return false; // If no reserved session found
  }, [reservedSessions]);

  const _date = useCallback((date: DateObject) => {
    return DateHandler.formatDate(date.toUnix() * 1000, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }, []);

  const _child = useCallback((date: DateObject, index: number) => {
    return children(
      _date(date),
      _time(index),
      _isReserved(index, _date(date))
    )
  }, [_date, _time, children, _isReserved])

  function calculateSessionTime(startTime: string, duration: number) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    // Convert start time to minutes
    const totalStartMinutes = startHour * 60 + startMinute;
    // Calculate end time in minutes
    const totalEndMinutes = totalStartMinutes + duration;
    // Calculate hours and minutes for end time
    const endHour = Math.floor(totalEndMinutes / 60);
    const endMinute = totalEndMinutes % 60;

    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  }


  const CustomButton = useCallback(
    (
      direction: "right" | "left",
      handleClick?: (event: any) => void,
      disabled?: boolean
    ) => {
      return (
        <i
          onClick={(event) => {
            if (direction === "left") {
              if (currentWeek === 1) {
                setCurrentWeek(5);
                handleClick?.(event);
              } else {
                setCurrentWeek((prevState) => prevState - 1);
              }
            } else {
              if (currentWeek === 5) {
                setCurrentWeek(1);
                handleClick?.(event);
              } else {
                setCurrentWeek((prevState) => prevState + 1);
              }
            }
          }}
          className={`px-8 text-[18px] font-bold ${disabled ? "cursor-default text-common-gray-dark" : "cursor-pointer text-info-dark"}`}
        >
          {direction === "right" ? ">" : "<"}
        </i>
      );
    },
    [currentWeek]
  );
  const handleSessionClick = (time: Time) => {
    setSelectedSession(time);
  };
  return (
    <div className={`rdmp-week-${currentWeek}`}>
      <PersianCalendar
        holder={(date) => holder?.(date, selectedSession)}
        calendarOptions={{
          renderButton: CustomButton,
          mapDays(object):
            | (React.HTMLAttributes<HTMLSpanElement> & {
            disabled?: boolean;
            hidden?: boolean;
          })
            | void {
            return {
              children: (
                <div className={"flex flex-col gap-2"}>
                  {React.Children.toArray(
                    [...Array((workingHours * 60) / sessionLength)].map(
                      (_, index) => (
                        <>
                          {index === 0 && (
                            <div className={"z-[40000] bg-background-default sticky top-[40px]"}>{_date(object.date)}</div>
                          )}
                          {React.cloneElement(
                            _child(object.date, index),
                            {
                              onClick: () => handleSessionClick(_time(index)),
                              className: twMerge(_child(object.date, index).props.className, "p-2")
                            }
                          )}
                        </>
                      )
                    )
                  )}
                </div>
              )
            };
          }
        }}
        placeholder={placeholder}
        onDateChange={(selected_date) => {
          // onDateChange?.(selected_date);
          // console.log(selected_date);
        }}
      />
    </div>
  );
};
