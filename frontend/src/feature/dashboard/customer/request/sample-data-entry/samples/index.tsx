import React from "react";
import ListItem from "../list-item";
import AddSample from "../button-add-sample";
import { Card } from "@kit/card";
import { FormResponseType } from "@api/service/form-response/type";

const Samples = ({
  samples,
  click,
  experiment,
  unitType,
}: {
  samples: FormResponseType[];
  click: () => void;
  experiment: string;
  unitType: string;
}) => {
  return (
    <>
      <Card color="info" className="w-full p-[24px] text-typography-main">
        <p className=" mb-[24px] text-[14px] text-typography-main">
          اطلاعات نمونه‌هایی که قصد دارید تا آزمون “{experiment}” بر روی آن‌ها
          انجام شود را در این قسمت وارد کنید.
        </p>
        <div className="grid grid-cols-1 gap-[32px] md:grid-cols-2 lg:grid-cols-3">
          {samples
            ?.filter((sample) => sample.is_main)
            .map((sample, index) => (
              <ListItem
                key={index}
                sample={{ ...sample }}
                sampleIndex={index}
                unitType={unitType}
              />
            ))}
          <AddSample click={click} />
        </div>
      </Card>
    </>
  );
};

export default Samples;
