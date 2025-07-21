import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Card } from "@kit/card";
import Tooltip from "@kit/tooltip";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { apiUser } from "@api/service/user";
import { IcMore } from "@feature/kits/common/icons";
import { ExperimentsType } from "@api/service/laboratory/type";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { Status } from "@kit/status";
import { useRouter } from "next/router";
import { apiRequest } from "@api/service/request";
interface TestCardProps {
  experiment: ExperimentsType;
  laboratoryStatus: string;
}

export const TestCard = (props: TestCardProps) => {
  const router = useRouter();
  const { experiment, laboratoryStatus } = props;
  const openModal = useModalHandler((state) => state.openModal);
  const handleOpenModal = (modalKey: ModalKeys) => () => {
    // if (experiment.status !== "active") return;
    // pass modal key and test id
    openModal(modalKey, {
      experimentId: experiment.id,
      selectedParameters: [],
      laboratoryStatus: laboratoryStatus,
      experimentStatus: experiment.status,
      deviceStatus: experiment?.device_obj?.status,
    });
  };
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "زمان (دقیقه)" },
      { value: "hour", name: "زمان (ساعت)" },
    ];
  }, []);
  // get user info
  const { data: user } = useQuery({
    ...apiUser().me(),
  });
  const isPartner = useMemo(() => {
    return user?.data?.is_partner;
  }, [user]);
  // set isPartner in state management
  const setIsPartner = useCurrentRequestHandler((state) => state.setIsPartner);
  setIsPartner(isPartner);

  // set requestId in state management
  // const setRequestId = useCurrentRequestHandler((state) => state.setRequestId);
  // request create api
  const { mutateAsync: createParentRequest } = useMutation(
    apiRequest(false).create(),
  );
  // const { mutateAsync: createChildRequest } = useMutation(
  //   apiRequest(false).create(),
  // );
  // ***** parameters should update for development and production *****
  const appointmentModal = () => {
    openModal(ModalKeys.CUSTOMER_SELECT_APPOINTMENT, {
      experimentId: experiment.id,
      appointmentDescription: experiment.description_appointment,
      serviceData: {
        experiment: Number(experiment.id),
        parameter: [],
        // parameter: [1],
        has_parent_request: true,
        parent_request: Number(router.query.request),
      },
    });
  };
  const createRequest = () => {
    if (!router.query.hasOwnProperty("request")) {
      submitParentRequest();
    } else {
      appointmentModal();
    }
  };
  const submitParentRequest = () => {
    const data = {
      experiment: Number(experiment.id),
      parameter: [],
      // parameter: [1],
    };
    createParentRequest(data)
      .then((res) => {
        router.query.request = res?.data.id?.toString();
        router.push(router);
        appointmentModal();
        // submitchildRequest();
      })
      .catch((err) => {});
  };
  // const submitchildRequest = () => {
  //   const data = {
  //     experiment: Number(experiment.id),
  //     parameter: [66],
  //     has_parent_request: true,
  //     parent_request: Number(router.query.request),
  //   };
  //   createChildRequest(data)
  //     .then((res) => {
  //       // set request id state
  //       setRequestId(res?.data.id);
  //       openModal(ModalKeys.CUSTOMER_SELECT_APPOINTMENT, {
  //         experimentId: experiment.id,
  //         appointmentDescription: experiment.description_appointment,
  //       });
  //     })
  //     .catch((err) => {});
  // };

  return (
    <>
      <Card
        color="white"
        className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-5"
      >
        <Card className="flex flex-col md:flex-row">
          <div className="flex w-full flex-col items-center md:w-[80%] md:flex-col">
            <div className="flex w-full flex-row pb-4">
              <h3 className="flex grow flex-row items-center gap-2 text-[18px] font-[700]">
                آزمون {experiment.name + " (" + experiment.name_en + ")"}
                {experiment?.status === "inactive" && (
                  <Status color={`error`}>غیرفعال</Status>
                )}
              </h3>
            </div>
            <div className="flex w-full flex-col md:flex-row">
              <div className="flex w-full flex-col gap-4 md:w-[50%]">
                <div className="flex flex-row flex-wrap items-center">
                  <div
                    className={`ml-2 h-[8px] w-[8px] rounded-full bg-common-gray`}
                  />
                  <h6 className="text-[15px] font-[550] ">نوع واحد آزمون:</h6>
                  <span className="text-wrap pr-1 text-[14px]">
                    {unitsList.find(
                      (unit) => unit.value === experiment.test_unit_type,
                    )?.name ?? experiment.test_unit_type}
                  </span>
                </div>
                <div className="flex flex-row flex-wrap items-center">
                  <div
                    className={`ml-2 h-[8px] w-[8px] rounded-full bg-common-gray`}
                  />
                  <h6 className="text-[15px] font-[550]">
                    زمان انتظار انجام آزمون:
                  </h6>
                  <span className="text-wrap pr-1 text-[14px]">
                    {`${experiment.estimated_result_time} روز کاری`}
                  </span>

                  {experiment.estimated_result_time && !isPartner && (
                    <span className="my-3 text-wrap rounded-full bg-error bg-opacity-5 px-3 py-[6px] text-[13px] text-error md:mx-2 md:my-0">
                      <span className="ml-1 font-semibold">فوری: </span>
                      {`${experiment.estimated_urgent_result_time ?? "-"} روز کاری`}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex w-full flex-col gap-5 md:w-[50%]">
                <div className="flex flex-row flex-wrap items-center">
                  <div
                    className={`ml-2 h-[8px] w-[8px] rounded-full bg-common-gray`}
                  />
                  <h6 className="text-[15px] font-[550]">گستره کاری:</h6>
                  <span className="text-wrap pr-1 text-[14px]">
                    {experiment.work_scope}
                  </span>
                </div>
                <div className="flex flex-row flex-wrap items-center">
                  <div
                    className={`ml-2 h-[8px] w-[8px] rounded-full bg-common-gray`}
                  />
                  <h6 className="text-[15px] font-[550]">نام دستگاه:</h6>
                  <Tooltip message="مشاهده جزئیات دستگاه">
                    <span
                      className="flex cursor-pointer flex-row text-wrap pr-1 text-[14px]"
                      onClick={() =>
                        openModal(
                          ModalKeys.REQUEST_DEVICE_DETAIL,
                          experiment.device_obj,
                        )
                      }
                    >
                      {experiment.device_obj?.name}

                      <SvgIcon
                        fillColor="black"
                        className={
                          "mx-[6px] mb-[6px] cursor-pointer opacity-65 [&>svg]:h-[15px] [&>svg]:w-[16px]"
                        }
                      >
                        <IcMore />
                      </SvgIcon>
                    </span>
                  </Tooltip>
                  {experiment?.device_obj?.status === "inactive" && (
                    <Status color={`error`}>غیرفعال</Status>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-end pt-6 md:w-[20%] md:pt-0">
            <Button
              className="w-full md:w-auto"
              color="primary"
              variant={
                experiment.status === "active" &&
                experiment?.device_obj?.status === "active" &&
                laboratoryStatus === "active"
                  ? "solid"
                  : "outline"
              }
              onClick={
                () => {
                  if (
                    laboratoryStatus === "inactive" ||
                    experiment.status === "inactive" ||
                    experiment?.device_obj?.status === "inactive"
                  ) {
                    openModal(ModalKeys.INACTIVE_RESOURCE, {
                      laboratoryStatus: laboratoryStatus,
                      experimentStatus: experiment.status,
                      deviceStatus: experiment?.device_obj?.status,
                    });
                  } else {
                    if (experiment?.need_turn) {
                      createRequest();
                    } else {
                      // navigate to next step
                      router.query.exp = experiment.id.toString();
                      router.query.step = "2";
                      // delete router.query.request;
                      router.push(router);
                    }
                  }
                }
                // handleOpenModal(ModalKeys.REQUEST_PARAMETERS_LIST)
              }
            >
              {/* {experiment.status ? "انتخاب پارامترها" : "به من اطلاع بده"} */}
              {experiment?.need_turn ? "انتخاب نوبت" : "انتخاب پارامتر"}
            </Button>
          </div>
          <div className="flex flex-col flex-wrap gap-x-6 gap-y-2 pt-2 md:flex-row">
            {/* <div className="flex flex-row flex-wrap items-center whitespace-nowrap">
              <h6 className="text-[18px] font-[500]">اپراتور:</h6>
              <span className="pr-1 text-[14px]">
                {experiment.operator_name}
              </span>
            </div> */}
          </div>
        </Card>
        {/* <Card variant="outline" className="flex flex-col p-4">
          <div className="flex flex-row">
            <h3 className="grow text-[20px] font-[700]">مشخصات دستگاه</h3>
          </div>
          <div className="flex flex-col flex-wrap gap-x-6 gap-y-2 pt-2 md:flex-row">
            <div className="flex flex-row flex-wrap items-center">
              <h6 className="text-[16px] font-[550]">برند مدل:</h6>
              <span className="text-wrap pr-1 text-[14px]">
                {experiment.device_obj?.model}
              </span>
            </div>
            <div className="flex flex-row flex-wrap items-center">
              <h6 className="text-[16px] font-[550]">نام دستگاه:</h6>
              <span className="text-wrap pr-1 text-[14px]">
                {experiment.device_obj?.name}
              </span>
            </div>
            <div className="flex flex-row flex-wrap items-center">
              <h6 className="text-[16px] font-[550]">کاربرد:</h6>
              <span className="text-wrap pr-1 text-[14px]">
                {experiment.device_obj?.application}
              </span>
            </div>
            <div className="flex flex-row flex-wrap items-center">
              <h6 className="text-[16px] font-[550]">شرح خدمات:</h6>
              <span className="text-wrap pr-1 text-[14px] leading-7">
                {experiment.device_obj?.description}
              </span>
            </div>
          </div>
        </Card> */}
        {/* <div className="flex justify-end ">
          <Button
            className="w-full md:w-auto"
            color="primary"
            variant={experiment.status === "active" ? "solid" : "outline"}
            onClick={handleOpenModal(ModalKeys.REQUEST_PARAMETERS_LIST)}
          >
            {experiment.status ? "انتخاب پارامترها" : "به من اطلاع بده"}
          </Button>
        </div> */}
      </Card>
    </>
  );
};
