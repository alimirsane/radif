import React from "react";
import {
  IcCardList,
  IcCertificate,
  IcCheck,
  IcDiscount,
  IcNotAllowed,
  IcPrint,
  IcStopWatch,
  IcUploade,
  IcView,
} from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { CertificateParams, RequestType } from "@api/service/request/type";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { AccessLevelPermissions } from "@feature/dashboard/common/access-level/types";
import { RequestButton } from "../../../../../../../api/service/request/type/request-status/request-buttons";

const PageActions = (props: {
  request: RequestType | undefined;
  certificateObj: CertificateParams | undefined;
  requestId: number | undefined;
  onClick: () => void;
  isOnlyOperatorOrTechnical: boolean;
  isOnlyOperator: boolean;
  isOnlyReception: boolean;
  parentStatus: string;
  parentRemainingAmount: number;
}) => {
  const {
    request,
    certificateObj,
    requestId,
    onClick,
    isOnlyOperatorOrTechnical,
    isOnlyOperator,
    isOnlyReception,
    parentStatus,
    parentRemainingAmount,
  } = props;
  const openModal = useModalHandler((state) => state.openModal);
  // update request status
  const submitRequest = () => {
    openModal(ModalKeys.ACCEPT_REQUEST, {
      requestId: requestId,
      experimentName: request?.experiment_obj?.name,
    });
  };

  const rejectRequest = () => {
    openModal(ModalKeys.REJECT_REQUEST, { requestId: requestId });
  };
  const printHandler = () => {
    // we add this line to fix the negetive margin, when user scroll to bottom of page and then click on print button
    // window.scrollTo(0, 0);
    // window.print();

    const originalTitle = document.title;
    document.title = `${request?.request_number}-آزمون`; // Set document title for the print

    window.scrollTo(0, 0);
    window.print();

    document.title = originalTitle; // Reset original title after print
  };

  const uploadResult = (action_slug: string) => {
    openModal(ModalKeys.UPLOAD_RESULT, {
      request: request,
      certificateObj: certificateObj,
      action_slug: action_slug,
    });
  };
  const discount = () => {
    openModal(ModalKeys.REQUEST_DISCOUNT, requestId);
  };
  const ViewHistory = () => {
    openModal(ModalKeys.REQUEST_HISTORY, {
      request: request?.status_objs,
      experiment: request?.experiment_obj,
    });
  };
  const UpdateExperimentDuration = (test_unit_type: string) => {
    openModal(ModalKeys.EXPERIMENT_DURATION, {
      requestId: requestId,
      testUnitType: test_unit_type,
    });
  };
  const handleClick = (button: RequestButton) => () => {
    switch (button.action_slug) {
      case "print_result":
        printHandler();
        return;
      case "next_step":
        submitRequest();
        return;
      case "reject_step":
        rejectRequest();
        return;
      case "upload_result":
        uploadResult(button.action_slug);
        return;
      case "view_result":
        uploadResult(button.action_slug);
        return;
      case "request_discount":
        discount();
        return;
    }
  };

  const handleButtonPermissions = (
    button: RequestButton,
  ): Array<AccessLevelPermissions> => {
    switch (button.action_slug) {
      case "print_result":
      case "view_result":
        return ["view"];
      case "next_step":
      case "reject_step":
      case "request_discount":
      case "upload_result":
        return ["update"];
    }
  };
  // reception user only can change requets with status: "در ‌انتظار پذیرش" & "در انتظار پرداخت"
  // operator/technical user can not change requets with status: "در ‌انتظار پذیرش" & "در انتظار پرداخت"
  const handleDisabledButton = (button: RequestButton) => () => {
    switch (button.action_slug) {
      case "print_result":
        return false;
      case "next_step":
        if (
          (request?.latest_status_obj?.step_obj.name === "در ‌انتظار پذیرش" ||
            request?.latest_status_obj?.step_obj.name === "در انتظار پرداخت") &&
          isOnlyOperatorOrTechnical
        ) {
          return true;
        } else if (
          parentRemainingAmount !== 0 &&
          parentStatus === "در انتظار پرداخت"
        ) {
          return true;
        } else if (
          // request?.latest_status_obj?.step_obj.name === "در انتظار اپراتور" ||
          (request?.latest_status_obj?.step_obj.name === "در ‌انتظار نمونه" ||
            request?.latest_status_obj?.step_obj.name === "در حال انجام" ||
            request?.latest_status_obj?.step_obj.name === "تکمیل شده" ||
            request?.latest_status_obj?.step_obj.name === "رد شده") &&
          isOnlyReception
        ) {
          return true;
        } else if (
          request?.latest_status_obj?.step_obj.name === "در حال انجام" &&
          isOnlyOperator
        ) {
          return true;
        } else if (
          !request?.result_objs?.length &&
          request?.latest_status_obj?.step_obj.name === "در حال انجام"
        ) {
          return true;
        } else {
          return false;
        }
      case "reject_step":
        if (
          (request?.latest_status_obj?.step_obj.name === "در ‌انتظار پذیرش" ||
            request?.latest_status_obj?.step_obj.name === "در انتظار پرداخت") &&
          isOnlyOperatorOrTechnical
        ) {
          return true;
        } else if (
          // request?.latest_status_obj?.step_obj.name === "در انتظار اپراتور" ||
          (request?.latest_status_obj?.step_obj.name === "در ‌انتظار نمونه" ||
            request?.latest_status_obj?.step_obj.name === "در حال انجام" ||
            request?.latest_status_obj?.step_obj.name === "تکمیل شده" ||
            request?.latest_status_obj?.step_obj.name === "رد شده") &&
          isOnlyReception
        ) {
          return true;
        } else if (
          request?.latest_status_obj?.step_obj.name === "در حال انجام" &&
          isOnlyOperator
        ) {
          return true;
        } else {
          return false;
        }
      case "upload_result":
        return isOnlyReception ? true : false;
      case "view_result":
        // return isOnlyReception || !request?.result_objs?.length ? true : false;
        return !request?.result_objs?.length ? true : false;
      case "request_discount":
        if (
          request?.latest_status_obj?.step_obj.name === "در انتظار اپراتور" &&
          isOnlyReception
        ) {
          return true;
        } else if (
          request?.latest_status_obj?.step_obj.name === "در ‌انتظار پذیرش" &&
          isOnlyOperatorOrTechnical
        ) {
          return true;
        } else {
          return false;
        }
    }
  };
  return (
    <div
      id="PageActions"
      className="flex h-fit w-full flex-col flex-wrap items-center gap-[12px] rounded-[8px] bg-background-paper-light p-[24px] lg:flex-row lg:items-start"
    >
      {/* {isOnlyOperatorOrTechnical
        ? "*isOnlyOperatorOrTechnical*"
        : "*notOperatorOrTechnical*"}
      {isOnlyReception ? "*isOnlyReception*" : "*notReception*"} */}
      {React.Children.toArray(
        request?.latest_status_obj?.step_obj?.buttons?.map((button) => (
          <AccessLevel
            module={"request"}
            permission={handleButtonPermissions(button)}
          >
            <Button
              variant="outline"
              onClick={handleClick(button)}
              color={button.color ?? "primary"}
              className={`text-${button.color} w-full lg:w-auto`}
              // disabled={
              //   (button.action_slug === "view_result" &&
              //     !request.result_objs?.length) ||
              //   // disable next-step button when no results have been uploaded yet
              //   (button.action_slug === "next_step" &&
              //     !request?.result_objs?.length &&
              //     request?.latest_status_obj
              //       ?.step_obj?.name === "در حال انجام")
              //     ? true
              //     : false
              // }
              disabled={handleDisabledButton(button)()}
              startIcon={
                <SvgIcon
                  fillColor={button.color ?? "primary"}
                  className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
                >
                  {button.action_slug === "reject_step" && <IcNotAllowed />}
                  {button.action_slug === "print_result" && <IcPrint />}
                  {button.action_slug === "upload_result" && <IcUploade />}
                  {button.action_slug === "next_step" && <IcCheck />}
                  {button.action_slug === "view_result" && <IcView />}
                  {button.action_slug === "request_discount" && <IcDiscount />}
                </SvgIcon>
              }
            >
              {button.action_slug === "next_step" &&
              request?.latest_status_obj?.step_obj?.name === "در حال انجام"
                ? "تکمیل درخواست"
                : button.title}
            </Button>
          </AccessLevel>
        )),
      )}
      {(request?.latest_status_obj?.step_obj?.name === "در ‌انتظار پذیرش" ||
        request?.latest_status_obj?.step_obj?.name === "در انتظار اپراتور") &&
        request?.experiment_obj?.test_unit_type !== "نمونه" &&
        request?.experiment_obj?.test_unit_type !== "sample" && (
          <Button
            variant="outline"
            color="secondary"
            onClick={() =>
              UpdateExperimentDuration(
                request?.experiment_obj?.test_unit_type ?? "",
              )
            }
            startIcon={
              <SvgIcon
                fillColor="secondary"
                className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
              >
                <IcStopWatch />
              </SvgIcon>
            }
            className="w-full text-secondary lg:w-auto"
          >
            مدت زمان آزمون
          </Button>
        )}
      <Button
        variant="outline"
        onClick={ViewHistory}
        startIcon={
          <SvgIcon className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}>
            <IcCardList />
          </SvgIcon>
        }
        className="w-full lg:w-auto"
      >
        تاریخچه درخواست
      </Button>

      {request?.latest_status_obj?.step_obj?.name === "تکمیل شده" && (
        <Button
          variant="outline"
          color="info"
          onClick={onClick}
          startIcon={
            <SvgIcon
              fillColor="info"
              className={"[&_svg]:h-[20px] [&_svg]:w-[20px]"}
            >
              <IcCertificate />
            </SvgIcon>
          }
          className="w-full text-info lg:w-auto"
        >
          گواهینامه آزمون
        </Button>
      )}
    </div>
  );
};

export default PageActions;
