import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { routes } from "@data/routes";
import { SvgIcon } from "@kit/svg-icon";
import ReturnSample from "./return-sample";
import LabsnetGrant from "./labsnet-grant";
import FinancialInfo from "./financial-info";
import ExperimentInfo from "./experiment-info";
import { apiRequest } from "@api/service/request";
import { IcPlus } from "@feature/kits/common/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import ResearchGrant from "./research-grant";
import { apiOrder } from "@api/service/order";
import { apiUser } from "@api/service/user";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const SubRequests = () => {
  const router = useRouter();

  const openModal = useModalHandler((state) => state.openModal);

  const [isLabsnetMessage, setIsLabsnetMessage] = useState(false);
  const [hasUncompletedChild, setHasUncompletedChild] =
    useState<boolean>(false);
  const [selectedResearchGrants, setSelectedResearchGrants] = useState<
    number[]
  >([]);
  const [selectedLabsnetGrants, setSelectedLabsnetGrants] = useState<string[]>(
    [],
  );
  // callback to update selected research items
  const handleSelectedResearchGrants = (items: number[]) => {
    setSelectedResearchGrants(items);
  };
  // callback to update selected labsnet items
  const handleSelectedLabsnetGrants = (items: string[]) => {
    setSelectedLabsnetGrants(items);
  };
  const handleLabsnetMessage = (msg: boolean) => {
    setIsLabsnetMessage(msg);
  };
  // get request data
  const {
    data: request,
    isLoading: requestLoading,
    refetch: refetchParentRequest,
  } = useQuery(apiRequest().getById(router.query.request as string));

  useEffect(() => {
    refetchParentRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  // check if button is clicked
  const [isSubmitting, setIsSubmitting] = useState(false);
  // order create api
  const { mutateAsync: createOrder } = useMutation(apiOrder(false).create());
  const createRequestOrder = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = {
      request: Number(router.query.request),
      buyer: user?.data.id,
      // grant_request1: selectedResearchGrants[0] || null,
      // grant_request2: selectedResearchGrants[1] || null,
    };
    createOrder(data)
      .then((res) => {
        // createRequest();
        updateLabsnetGrant();
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };
  // update labsnet api
  const { mutateAsync: updateLabsnet } = useMutation(
    apiRequest(false).updateLabsnet(Number(router.query.request)),
  );
  const updateLabsnetGrant = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data: Record<string, string> = {};

    if (selectedLabsnetGrants[0]) {
      data.labsnet1_id = selectedLabsnetGrants[0];
    }

    if (selectedLabsnetGrants[1]) {
      data.labsnet2_id = selectedLabsnetGrants[1];
    }
    updateLabsnet(data)
      .then((res) => {
        createRequest();
      })
      .catch((err) => {
        setIsSubmitting(false);
      });
  };
  // create request api
  const { mutateAsync: completeRequest } = useMutation(
    apiRequest(true, {
      success: "ثبت نهایی درخواست موفقیت آمیز بود",
      fail: "ثبت نهایی درخواست انجام نشد",
      waiting: "در حال انتظار",
    }).completeRequest(Number(router.query.request)),
  );
  const createRequest = () => {
    const data = {
      is_completed: true,
      grant_request1: selectedResearchGrants[0] || null,
      grant_request2: selectedResearchGrants[1] || null,
      labsnet_code1: selectedLabsnetGrants[0] || null,
      labsnet_code2: selectedLabsnetGrants[1] || null,
    };
    completeRequest(data)
      .then(async (res) => {
        await router.push(routes.customerRequestsList());
        if (Number(request?.data?.total_prepayment_amount) !== 0) {
          openModal(ModalKeys.REDIRECT_TO_PREPAYMENT, {
            requestId: request?.data?.id,
            requestTotalPrePayment: res?.data?.total_prepayment_amount,
          });
        }
      })
      .catch((err) => {});
  };
  // submit parent request
  const finalSubmit = () => {
    if (!isLabsnetMessage) {
      request?.data?.is_completed || request?.data?.order_obj?.length !== 0
        ? updateLabsnetGrant()
        : createRequestOrder();
    }
  };
  // get back to steps to add new child request
  const addChildRequest = () => {
    // delete router.query.lab;
    router.query.action = "add";
    router.query.step = "1";
    router.push(router);
  };
  // check if request has uncompleted child
  useEffect(() => {
    if (!!request?.data?.child_requests?.length) {
      setHasUncompletedChild(
        request?.data?.child_requests?.some((child) => !child.is_completed),
      );
    }
  }, [request?.data?.child_requests]);

  return (
    <>
      {request?.data ? (
        <Card
          color="info"
          className="flex flex-col items-center p-6 lg:px-16 lg:pb-12 lg:pt-10"
        >
          <h6 className="w-full text-[14px]">
            لطفا اطلاعات درخواست خود را تایید کنید و یا درصورت نیاز آزمون جدیدی
            اضافه نمایید.
          </h6>
          <Card color="white" className="mt-6 w-full px-4 pb-4 pt-6 lg:px-8">
            <h6 className="mb-3 text-[16px] font-bold">اطلاعات آزمون‌ها</h6>
            {request?.data?.child_requests?.map((child, index) => (
              <Card
                key={index}
                color="white"
                variant="outline"
                className="my-4 flex w-full flex-col p-5 lg:px-8 lg:pb-7 lg:pt-6"
              >
                <ExperimentInfo child={child} />
              </Card>
            ))}
            {request?.data?.child_requests &&
            request?.data?.child_requests?.length < 6 ? (
              <Card
                color="white"
                variant="outline"
                onClick={addChildRequest}
                className="my-4 flex w-full cursor-pointer flex-row items-center justify-center gap-2 bg-background-paper-light p-7"
              >
                <SvgIcon
                  fillColor={"black"}
                  className={"opacity-55 [&_svg]:h-[28px] [&_svg]:w-[28px]"}
                >
                  <IcPlus />
                </SvgIcon>
                <span className="font-semibold text-common-gray">
                  ثبت آزمون جدید
                </span>
              </Card>
            ) : (
              <Card
                color="error"
                className="my-4 flex w-full flex-row items-center justify-center gap-2 bg-opacity-5 p-5"
              >
                <span className="text-[14px] font-semibold text-error">
                  شما می‌توانید حداکثر 5 آزمون ثبت کنید.
                </span>
              </Card>
            )}
          </Card>

          <Card color="white" className="mt-6 w-full px-4 py-6 lg:px-8">
            <h6 className="mb-3 text-[16px] font-bold">انتخاب گرنت</h6>
            <LabsnetGrant
              onSelectItems={handleSelectedLabsnetGrants}
              isLabsnet={request?.data?.labsnet}
              labsnet_code1={request?.data?.labsnet_code1 ?? ""}
              labsnet_code2={request?.data?.labsnet_code2 ?? ""}
              labsnetMessage={handleLabsnetMessage}
            />
            <ResearchGrant
              onSelectItems={handleSelectedResearchGrants}
              grant_request1={request?.data?.grant_request1}
              grant_request2={request?.data?.grant_request2}
              is_completed={request?.data?.is_completed ?? false}
            />
          </Card>

          <Card color="white" className="mt-6 w-full px-4 py-6 lg:px-8">
            <ReturnSample isReturned={request?.data?.is_sample_returned} />
          </Card>

          <Card color="white" className="mt-6 w-full px-4 pb-8 pt-6 lg:px-8">
            <h6 className="mb-3 text-[16px] font-bold">اطلاعات مالی</h6>
            <FinancialInfo
              price_wod={request?.data?.price_wod}
              price={request?.data?.price}
              price_sample_returned={request?.data?.price_sample_returned}
            />
          </Card>
        </Card>
      ) : (
        <div>در حال بارگذاری...</div>
      )}
      <div className="flex flex-col-reverse justify-end pt-3 sm:flex-row sm:py-7">
        {request?.data?.child_requests &&
          request?.data?.child_requests?.length < 6 && (
            <Button
              className="my-2 w-full sm:mx-5 sm:my-auto sm:w-auto"
              variant="outline"
              startIcon={
                <SvgIcon
                  strokeColor={"primary"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcPlus />
                </SvgIcon>
              }
              onClick={addChildRequest}
            >
              ثبت آزمون جدید
            </Button>
          )}
        <Button
          className="my-2 w-full py-[9px] sm:my-auto sm:w-auto"
          onClick={finalSubmit}
          disabled={isLabsnetMessage || hasUncompletedChild || isSubmitting}
        >
          ثبت نهایی درخواست
        </Button>
      </div>
    </>
  );
};

export default SubRequests;
