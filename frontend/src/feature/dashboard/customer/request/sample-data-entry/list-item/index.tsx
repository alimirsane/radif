import React from "react";

import { FormResponseType } from "@api/service/form-response/type";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcCopy, IcDelete } from "@feature/kits/common/icons";
import { apiFormResponse } from "@api/service/form-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FBSimpleLoader } from "@module/form-builder/simple-loader";
import { useRouter } from "next/router";
import Tooltip from "@kit/tooltip";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { useCopySampleHandler } from "@hook/copy-sample-handler";
import { FBElementProp } from "@module/form-builder/type/sample";
import { apiRequest } from "@api/service/request";
import { Button } from "@kit/button";

const ListItem = ({
  sample,
  sampleIndex,
  unitType,
}: {
  sample: FormResponseType;
  sampleIndex: number;
  unitType: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const openModal = useModalHandler((state) => state.openModal);

  const handleOpenModal = (modal: ModalKeys, sample_id: number) => () => {
    openModal(modal, sample);
  };
  const { samples, deleteSample } = useCopySampleHandler();
  // Find the sample count
  const sampleCount =
    samples.find((s) => s.sample_id === sample.id)?.count || "صفر";

  const { mutateAsync } = useMutation(
    apiFormResponse(true, {
      success: "حذف نمونه موفقیت آمیز بود",
      fail: "حذف نمونه انجام نشد",
      waiting: "در حال انتظار",
    }).delete(sample.id.toString()),
  );
  const deletedSampleHandler = () => {
    mutateAsync(sample.id.toString())
      .then((res) => {
        queryClient.invalidateQueries({
          queryKey: [apiFormResponse().url],
        });
        queryClient.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        deleteSample(sample.id);
      })
      .catch((err) => {});
  };

  return (
    <div className="flex w-full flex-col rounded-[8px] bg-common-white p-[14px] text-typography-main">
      <span className="flex flex-row items-center justify-between">
        <h5 className="text-[16px] font-bold">نمونه {sampleIndex + 1}</h5>
        <span className="flex flex-row gap-3">
          {/* <Fab
            className="bg-primary-light bg-opacity-35 p-[6px]"
            onClick={handleOpenModal(ModalKeys.COPY_SAMPLE, sample.id)}
          >
            <Tooltip message="تعداد نمونه">
              <SvgIcon
                fillColor={"primary"}
                className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
              >
                <IcCopy />
              </SvgIcon>
            </Tooltip>
          </Fab> */}
          <Fab
            className="bg-error-light bg-opacity-40 p-[6px]"
            onClick={deletedSampleHandler}
          >
            <Tooltip message="حذف نمونه">
              <SvgIcon
                fillColor={"error"}
                className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
              >
                <IcDelete />
              </SvgIcon>
            </Tooltip>
          </Fab>
        </span>
      </span>
      {/* <span className="mb-[4px]">
        <span className="text-[14px]">کد نمونه: </span>
        <span className="text-[15px] font-bold">{sample.form_number}</span>
      </span> */}
      {/* <br /> */}
      <div className="flex-grow">
        <FBSimpleLoader jsonFB={sample.response_json as FBElementProp[]} />
      </div>
      {/*{sample.response_json*/}
      {/*  .filter((item) => item.element !== "button")*/}
      {/*  .map((item, index) => (*/}
      {/*    <div key={index} className="items-center py-1">*/}
      {/*      <span className="text-[14px]">{item.label}:</span>*/}
      {/*      <span className="pr-2 text-[15px] font-bold">*/}
      {/*        {item.options*/}
      {/*          ? item.options.find((option) => option.value === item.value)*/}
      {/*              ?.label*/}
      {/*          : item.value}*/}
      {/*      </span>*/}
      {/*    </div>*/}
      {/*  ))}*/}

      {(unitType === "sample" || unitType === "نمونه") && (
        <p className="mt-2 flex flex-row items-center justify-between border-t-2 border-t-background-paper-dark pt-3 text-[14px]">
          <span>
            <span className="whitespace-nowrap">تعداد نمونه: </span>
            <span className="font-[700]">
              {sample.response_count !== 0 ? sample.response_count : 1}
            </span>
          </span>
          <Button
            variant="outline"
            onClick={handleOpenModal(ModalKeys.COPY_SAMPLE, sample.id)}
          >
            ثبت تعداد نمونه
          </Button>
        </p>
      )}
    </div>
  );
};

export default ListItem;
