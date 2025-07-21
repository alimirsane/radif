import { Card } from "@kit/card";
import { RequestStatus } from "@api/service/request/type/request-status";

const StatusBar = (props: { statusList: Array<RequestStatus> }) => {
  const { statusList } = props;
  const statusBarList = [
    "در انتظار اپراتور",
    "در انتظار پرداخت",
    "در ‌انتظار نمونه",
    "در حال انجام",
    "تکمیل شده",
    "رد شده",
  ];
  const passedStatus = statusList.map((obj) => obj.step_obj.name);

  return (
    <div className="flex gap-[16px] overflow-x-auto lg:justify-center">
      {statusBarList.map((status, index) => (
        <Card
          key={index}
          className={
            "w-36 flex-shrink-0 py-4 text-center text-[18px] font-bold"
          }
          color={passedStatus.includes(status) ? "success" : "paper"}
        >
          {status}
        </Card>
      ))}
    </div>
  );
};

export default StatusBar;
