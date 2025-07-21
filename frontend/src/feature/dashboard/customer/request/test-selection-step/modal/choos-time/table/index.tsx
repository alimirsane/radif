import { Card } from "@kit/card";
import { days, times } from "./data";

const Table = () => {
  return (
    <div className="mt-[48px] flex flex-col gap-[16px]">
      <div className="flex w-full">
        {days.map((day, index) => (
          <div key={index} className="w-2/12">
            {day.name && (
              <Card
                variant="outline"
                color="white"
                className="flex h-[88px] flex-col items-center justify-center gap-[4px] rounded-none"
              >
                <p className="text-[18px] font-bold">{day.name}</p>
                <p className="text-[14px]">{day.date}</p>
              </Card>
            )}
          </div>
        ))}
      </div>
      {Object.entries(times).map(([key, value], index) => (
        <div className="flex w-full items-center gap-[16px]" key={index}>
          <div className="flex w-2/12 flex-row-reverse text-[18px] font-bold">
            {key}
          </div>
          {value.map((day, iT) => (
            <div className="flex w-2/12 flex-col gap-[4px]" key={index}>
              {day.times.map((time, iTime) => (
                <Card
                  key={iTime}
                  color={time.name ? "success" : "paper"}
                  className={`flex h-[88px] flex-col items-center justify-center gap-[4px] rounded-none border-[1px] ${time.name ? "border-success" : "border-common-gray/20"}`}
                >
                  <p className="text-[14px] font-medium">{time.name}</p>
                  <p className="text-[12px] font-medium">{time.traked}</p>
                </Card>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
