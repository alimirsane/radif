import { useMemo } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { apiLaboratory } from "@api/service/laboratory";

import { Card } from "@kit/card";
import { LaboratoryTestsList } from "./laboratory-tests-list";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcArrowRight, IcCardList } from "@feature/kits/common/icons";
import { LaboratorySpecifications } from "@feature/dashboard/customer/request/test-selection-step/laboratory-specifications";

export const TestSelectionStep = () => {
  const router = useRouter();

  const labId = useMemo(() => {
    return router.query.lab as string;
  }, [router.query.lab]);

  const { data: laboratory } = useQuery(apiLaboratory().getByIdPublic(labId));
  const labSpecifications = useMemo(() => {
    return {
      status: laboratory?.data.status === "active" ? "فعال" : "غیر فعال",
      specifications: {
        "نام آزمایشگاه": laboratory?.data.name
          ? laboratory?.data.name + " (" + laboratory?.data.name_en + ") "
          : "---",
        "نام مدیر فنی": laboratory?.data.technical_manager_obj?.first_name
          ? laboratory?.data.technical_manager_obj?.first_name +
            " " +
            laboratory?.data.technical_manager_obj?.last_name
          : "---",
        "نام دانشکده": laboratory?.data.department_obj?.name ?? "---",
      },
    };
  }, [laboratory]);

  return (
    <>
      <Card color="info" className="p-4 md:p-6">
        {/* <p className="pb-5 text-[14px]">
          آزمون و دستگاه‌های موجود در آزمایشگاه انتخاب شده توسط شما به شرح زیر
          می‌باشد:
        </p> */}
        <LaboratorySpecifications
          status={labSpecifications.status}
          specifications={labSpecifications.specifications}
          description={laboratory?.data.description}
        />
        <LaboratoryTestsList
          experiments={laboratory?.data.experiments}
          laboratoryStatus={laboratory?.data?.status ?? ""}
        />
      </Card>
      <div className="flex flex-col justify-end pt-4 sm:flex-row sm:py-7">
        {router.query.action === "add" ? (
          <Button
            className="my-2 w-full sm:my-auto sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[18px] [&_svg]:w-[18px]"}
              >
                <IcCardList />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              router.query.step = "6";
              router.push(router);
            }}
          >
            آزمون‌های ثبت شده
          </Button>
        ) : (
          <Button
            className="my-2 w-full sm:my-auto sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcArrowRight />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              router.query = { step: "1" };
              router.push(router);
            }}
          >
            مشاهده لیست آزمایشگاه‌ها
          </Button>
        )}
        {/* ----------- we decide to only use submit button in experiment modal ----------- */}
        {/* <Button
          variant="solid"
          endIcon={
            <SvgIcon
              fillColor={"white"}
              className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
            >
              <IcArrowLeft />
            </SvgIcon>
          }
          color="primary"
          className="w-full sm:w-auto"
          onClick={() => {
            delete router.query.totalCost;
            delete router.query.selectedCount;
            delete router.query.item;
            router.query.step = "2";
            router.push(router);
          }}
          disabled={!router.query.selectedCount}
        >
          شرایط و قوانین
        </Button> */}
      </div>
    </>
  );
};
