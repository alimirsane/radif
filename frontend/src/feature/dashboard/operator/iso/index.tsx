import { apiIso } from "@api/iso";
import { IcStandard } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useQuery } from "@tanstack/react-query";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useMemo } from "react";
import Image from "next/image";
import NACI from "/public/images/naci-logo.png";

const ISO = () => {
  const openModal = useModalHandler((state) => state.openModal);
  const { data: isoData, isLoading: isoDataLoading } = useQuery({
    ...apiIso().getIsoStatus(),
  });
  const isoStatus = useMemo(() => {
    return isoData?.data?.is_visible_iso;
  }, [isoData]);
  return (
    <>
      {!isoDataLoading && (
        <Card
          className="mt-[30px] flex flex-col items-center justify-between gap-5 rounded-[8px] px-[24px] py-[20px] md:flex-row"
          variant={"outline"}
        >
          <div className="flex flex-row items-center gap-4">
            <p className="font-medium">
              هم‌اکنون ایزو ۱۷۰۲۵ برای آزمایشگاه‌ها{" "}
              <span
                className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] font-semibold ${isoStatus ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
              >
                {isoStatus ? "فعال" : "غیرفعال"}
              </span>{" "}
              می‌باشد.
            </p>
            <Button
              onClick={() => {
                openModal(ModalKeys.UPDATE_ISO, {
                  isoStatus: isoStatus,
                });
              }}
              color="primary"
              className="w-full md:w-auto"
              startIcon={
                <SvgIcon strokeColor={"white"}>
                  <IcStandard />
                </SvgIcon>
              }
            >
              {isoStatus ? "غیرفعال" : "فعال"} کردن ایزو
            </Button>
          </div>
          <div className={"flex flex-col pt-[1px]"}>
            <Image
              src={NACI}
              width={500}
              height={500}
              className="w-[150px]"
              alt="مرکز ملی تایید صلاحیت ایران"
              loading="eager"
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default ISO;
