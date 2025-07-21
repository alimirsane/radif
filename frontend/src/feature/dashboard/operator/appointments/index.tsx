import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Image from "next/image";
import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { Status } from "@kit/status";
import { SvgIcon } from "@kit/svg-icon";
import { useRouter } from "next/router";
import { useDebounce } from "@utils/use-debounce";
import { IcSearch } from "@feature/kits/common/icons";
import { apiExperiment } from "@api/service/experiment";

const Appointments = () => {
  const { value, setValue, debouncedValue } = useDebounce("");

  const router = useRouter();

  useEffect(() => {
    if (debouncedValue) {
      router.query.search_lab = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_lab;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const { data: experiments, isLoading: experimentsLoading } = useQuery(
    apiExperiment().getAll({
      search: router.query.search_lab,
    }),
  );

  return (
    <Card
      className={"my-6 px-4 pb-10 pt-7 text-typography-main sm:px-10"}
      color={"white"}
      variant="outline"
    >
      <div className="flex flex-col">
        <h2 className="text-[18px] font-semibold">لیست آزمون‌ها</h2>
        <p className="py-2 text-[14px]">
          لیست آزمون‌ها و وضعیت نوبت‌های آن‌ها را می توانید در این بخش مشاهده
          کنید.
        </p>
      </div>
      <div className="mt-[16px]">
        <div className="mb-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3 lg:gap-[32px]">
          <div className="mb-[12px] flex w-full flex-col gap-[8px] md:mb-[16px]">
            <Input
              className={" bg-common-white"}
              type={"text"}
              label={"جستجو"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={"نام آزمایشگاه یا آزمون را وارد کنید"}
              endNode={
                <SvgIcon
                  className={
                    "cursor-pointer [&_path]:fill-typography-gray [&_svg]:h-[15px] [&_svg]:w-[15px]"
                  }
                >
                  <IcSearch />
                </SvgIcon>
              }
            />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-[32px]">
          {experiments?.data.length !== 0 &&
            experiments?.data
              ?.filter((item) => item.need_turn)
              .map((experiment, index: number) => (
                <Card
                  key={index}
                  color="white"
                  className="flex w-full cursor-pointer flex-col rounded-[16px] border border-background-paper-dark p-[16px] text-typography-main"
                  onClick={() => {
                    if (!experiment.need_turn) return;
                    router.query.experiment = "view";
                    router.query.name = experiment.id + "$" + experiment.name;
                    router.push(router);
                  }}
                >
                  {/* <div
                  className="relative w-full"
                  style={{ paddingBottom: "66.67%" }}
                >
                  <Image
                    src={experiment?.laboratory_obj?.image ?? ""}
                    alt={experiment?.laboratory_obj?.name ?? "عکس آزمایشگاه"}
                    layout="fill" 
                    objectFit="cover" 
                    className="absolute inset-0 rounded-[16px]" 
                  />
                </div> */}
                  <div className="flex flex-col justify-between pb-[4px] pt-[16px] md:flex-row">
                    <h5 className="text-[18px] font-bold">
                      آزمون {experiment?.name}
                    </h5>

                    {experiment?.status === "inactive" && (
                      <span className="self-end">
                        <Status color={`error`}>غیرفعال</Status>
                      </span>
                    )}
                  </div>
                  <p className="text-[14px]">
                    آزمایشگاه {experiment?.lab_name}
                  </p>

                  <div className="mt-auto">
                    <Button
                      className="mx-auto mt-[16px] w-full md:w-fit"
                      onClick={() => {
                        if (!experiment.need_turn) return;
                        router.query.experiment = "view";
                        router.query.name =
                          experiment.id + "$" + experiment.name;
                        router.push(router);
                      }}
                    >
                      مشاهده نوبت‌ها
                    </Button>
                  </div>
                </Card>
              ))}
          {experiments?.data.length === 0 && <p>موردی یافت نشد.</p>}
        </div>
      </div>
    </Card>
  );
};

export default Appointments;
