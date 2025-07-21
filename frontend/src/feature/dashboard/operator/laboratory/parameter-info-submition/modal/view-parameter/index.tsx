import { useMemo } from "react";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useModalHandler } from "@utils/modal-handler/config";

const ViewParameter = () => {
  // units types list
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get param details form modal
  const param = useModalHandler((state) => state.modalData);

  return (
    <Card
      color={"white"}
      className="flex max-h-[100vh] w-full flex-col overflow-y-auto p-8 md:max-h-[90vh] md:w-[80vw] xl:w-[60vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">جزئیات پارامتر</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <div className="grid grid-cols-1 gap-8 pb-2 text-right md:grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <Input
            value={param.name}
            disabled
            className="bg-background-paper"
            label={"نام پارامتر"}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Input
            value={param.name_en}
            disabled
            className="bg-background-paper"
            label={"نام انگلیسی پارامتر"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={`${Number(param.price).toLocaleString()} ریال`}
            disabled
            className="bg-background-paper"
            label={"هزینه"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={
              param.urgent_price !== "0"
                ? `${Number(param.urgent_price).toLocaleString()} ریال`
                : "---"
            }
            disabled
            className="bg-background-paper"
            label={"هزینه فوری"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={
              param.partner_price
                ? `${Number(param.partner_price).toLocaleString()} ریال`
                : "---"
            }
            disabled
            className="bg-background-paper"
            label={"هزینه مشتری همکار"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={
              param.partner_urgent_price
                ? `${Number(param.partner_urgent_price).toLocaleString()} ریال`
                : "---"
            }
            disabled
            className="bg-background-paper"
            label={"هزینه فوری مشتری همکار"}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Input
            value={param.exp_name}
            disabled
            className="bg-background-paper"
            label={"آزمون"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={unitsList.find((unit) => unit.value === param.unit)?.name}
            disabled
            className="bg-background-paper"
            label={"واحد اندازه گیری"}
          />
        </div>
        <div className={`col-span-2 md:col-span-1`}>
          <Input
            value={param.unit_value}
            disabled
            className="bg-background-paper"
            label={"مقدار واحد"}
          />
        </div>
      </div>
    </Card>
  );
};
export default ViewParameter;
