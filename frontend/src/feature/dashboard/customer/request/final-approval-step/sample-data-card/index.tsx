import { Card } from "@kit/card";
import { SampleDataType } from "./type";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { FormResponseType } from "@api/service/form-response/type";
import { FBSimpleLoader } from "@module/form-builder/simple-loader";
import { Fab } from "@kit/fab";
import Tooltip from "@kit/tooltip";
import { SvgIcon } from "@kit/svg-icon";
import { IcDelete, IcEdit } from "@feature/kits/common/icons";
import { useRouter } from "next/router";
import { FBElementProp } from "@module/form-builder/type/sample";

export const SampleDataCard = (props: SampleDataType) => {
  const router = useRouter();
  const { sampleNumber, sample, requestIsCompleted, test_unit_type } = props;
  // open sample edit modal
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal =
    (modalKey: ModalKeys, sample: FormResponseType) => () => {
      openModal(modalKey, sample);
    };

  return (
    <>
      <Card
        variant="outline"
        color="white"
        className="flex flex-1 flex-col px-5 pb-3 pt-6"
      >
        <div className="flex w-full flex-row items-center justify-between gap-4">
          <Card color="paper" className="flex-1 px-1 py-3 text-center md:px-3">
            <h6 className="text-[16px] font-[700]">
              نمونه {sampleNumber + 1} -{" "}
              <span className="text-common-gray">
                کد نمونه: {sample.form_number}
              </span>
            </h6>
          </Card>
          <span className="flex flex-row gap-2">
            {!requestIsCompleted && (
              <Fab
                variant="outline"
                className="p-[6px]"
                color="error"
                onClick={handleOpenModal(ModalKeys.DELETE_SAMPLE, sample)}
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
            )}
            <Fab
              variant="outline"
              className="p-[6px]"
              onClick={handleOpenModal(ModalKeys.EDIT_SAMPLE, sample)}
            >
              <Tooltip message="ویرایش نمونه">
                <SvgIcon
                  strokeColor={"primary"}
                  className={"[&>svg]:h-[18px] [&>svg]:w-[18px]"}
                >
                  <IcEdit />
                </SvgIcon>
              </Tooltip>
            </Fab>
            {/* <Button
              variant="outline"
              color="error"
              className="text-error"
              onClick={handleOpenModal(ModalKeys.EDIT_SAMPLE, sample)}
            >
              حذف
            </Button>
            <Button
              variant="outline"
              color="primary"
              onClick={handleOpenModal(ModalKeys.EDIT_SAMPLE, sample)}
            >
              ویرایش
            </Button> */}
          </span>
        </div>
        <div className="w-full flex-grow pb-2 pt-4">
          <FBSimpleLoader jsonFB={sample.response_json as FBElementProp[]} />
        </div>
        {(test_unit_type === "sample" || test_unit_type === "نمونه") && (
          <p className="mt-2 border-t-2 border-t-background-paper-dark pt-2 text-[14px] ">
            <span className="whitespace-nowrap">تعداد نمونه: </span>
            <span className="font-[700]">
              {sample.response_count !== 0 ? sample.response_count : 1}
            </span>
          </p>
        )}
        {/* <div className="w-full py-3 md:w-1/6 md:px-5 md:pt-[2px]">
          <Button
            variant="outline"
            color="primary"
            className="w-full"
            onClick={handleOpenModal(ModalKeys.EDIT_SAMPLE, sample)}
          >
            ویرایش
          </Button>
        </div> */}
      </Card>
    </>
  );
};
