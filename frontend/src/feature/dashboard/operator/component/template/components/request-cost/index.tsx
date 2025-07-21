import { RequestType } from "@api/service/request/type";
import {
  IcCheckCircle,
  IcCloseCircle,
  IcEye,
  IcQuestionCircle,
  IcReport,
} from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import Tooltip from "@kit/tooltip";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const RequestCost = (
  props: Pick<
    RequestType,
    | "labsnet_discount"
    | "price"
    | "price_sample_returned"
    | "price_wod"
    | "labsnet"
    | "labsnet_code1"
    | "labsnet_code2"
    | "order_obj"
    | "grant_request1_obj"
    | "grant_request2_obj"
    | "grant_request1"
    | "grant_request2"
    | "grant_request_discount"
    | "labsnet_result"
    | "labsnet_status"
    | "labsnet1_obj"
    | "labsnet2_obj"
    | "child_requests"
    | "request_number"
  >,
) => {
  const {
    labsnet,
    labsnet_code1,
    labsnet_code2,
    labsnet_discount,
    price,
    price_wod,
    price_sample_returned,
    order_obj,
    grant_request1_obj,
    grant_request2_obj,
    grant_request1,
    grant_request2,
    grant_request_discount,
    labsnet_result,
    labsnet_status,
    labsnet1_obj,
    labsnet2_obj,
    child_requests,
    request_number,
  } = props;

  const openModal = useModalHandler((state) => state.openModal);
  const getLabsnetStatus = (status: number | undefined) => {
    switch (status) {
      case 1:
        return (
          <Tooltip message="ثبت نشده">
            <SvgIcon
              fillColor={"info"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcQuestionCircle />
            </SvgIcon>
          </Tooltip>
        );
      case 2:
        return (
          <Tooltip message="ثبت موفق">
            <SvgIcon
              fillColor={"success"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCheckCircle />
            </SvgIcon>
          </Tooltip>
        );
      case 3:
        return (
          <Tooltip message="ثبت ناموفق">
            <SvgIcon
              fillColor={"error"}
              className={"mt-[4px] [&_svg]:h-[14px] [&_svg]:w-[14px]"}
            >
              <IcCloseCircle />
            </SvgIcon>
          </Tooltip>
        );
      default:
        return null;
    }
  };
  return (
    <div id="ParentRequestPriceInfo">
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray ">
        هزینه درخواست
      </h3>

      <div className="flex w-full flex-col flex-wrap gap-[16px] rounded-[8px] bg-background-paper-light px-4 py-[16px] md:flex-row md:items-center md:gap-[19px] md:px-[24px]">
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            هزینه آزمون‌ها
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {Number(price_wod ?? 0)?.toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            هزینه ارسال
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {Number(price_sample_returned ?? 0)?.toLocaleString()}
            {Number(price_sample_returned) !== 0 && (
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            )}
          </span>
        </div>
        <div className="flex flex-row gap-[4px] md:flex-col">
          <span className="flex flex-row gap-1 text-[16px] font-bold text-typography-main">
            کل گرنت لبزنت
            <span id="request-labsnet-grants">
              <Tooltip message="مشاهده گرنت‌ها">
                <SvgIcon
                  onClick={() => {
                    openModal(ModalKeys.LABSNET_GRANTS_LIST, {
                      labsnet: labsnet,
                      labsnet_code1: labsnet_code1,
                      labsnet_code2: labsnet_code2,
                      labsnet1_obj: labsnet1_obj,
                      labsnet2_obj: labsnet2_obj,
                      child_requests: child_requests,
                      request_number: request_number,
                    });
                  }}
                  strokeColor={"black"}
                  className={
                    "mt-[2px] cursor-pointer [&_svg]:h-[18px] [&_svg]:w-[18px]"
                  }
                >
                  <IcEye />
                </SvgIcon>
              </Tooltip>
            </span>
            <span id="request-labsnet-report">
              {getLabsnetStatus(labsnet_status)}
              {/* <Tooltip message="گزارش لبزنت">
                <SvgIcon
                  onClick={() => {
                    openModal(ModalKeys.LABSNET_GRANTS_REPORT, labsnet_result);
                  }}
                  fillColor={"info"}
                  className={
                    "mt-[4px] cursor-pointer [&_svg]:h-[15px] [&_svg]:w-[15px]"
                  }
                >
                  <IcReport />
                </SvgIcon>
              </Tooltip> */}
            </span>
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
            {Number(labsnet_discount ?? 0)?.toLocaleString()}
            {Number(labsnet_discount) !== 0 && (
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            )}
          </span>
        </div>
        <div className="flex flex-row gap-[4px] md:flex-col">
          <span className="flex flex-row gap-1 text-[16px] font-bold text-typography-main">
            کل گرنت پژوهشی
            <span id="request-research-grants">
              <Tooltip message="مشاهده گرنت‌ها">
                <SvgIcon
                  onClick={() => {
                    openModal(ModalKeys.RESEARCH_GRANTS_LIST, {
                      grant_request1: grant_request1,
                      grant_request2: grant_request2,
                      grant_record1: grant_request1_obj,
                      grant_record2: grant_request2_obj,
                    });
                  }}
                  strokeColor={"black"}
                  className={
                    "mt-[2px] cursor-pointer [&_svg]:h-[18px] [&_svg]:w-[18px]"
                  }
                >
                  <IcEye />
                </SvgIcon>
              </Tooltip>
            </span>
          </span>
          <span className="pr-[6px] text-[14px] text-typography-main md:pr-[1px]">
            {Number(grant_request_discount ?? 0)?.toLocaleString()}
            {Number(grant_request_discount) !== 0 && (
              <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
            )}
          </span>
        </div>
        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            هزینه نهایی
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {Number(price ?? 0)?.toLocaleString()}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>

        <div className="flex flex-row flex-wrap gap-[4px] md:flex-col">
          <span className="whitespace-nowrap text-[16px] font-bold text-typography-main">
            هزینه قابل پرداخت
          </span>
          <span className="whitespace-nowrap pr-[6px] text-[14px] md:pr-[1px]">
            {order_obj?.[order_obj.length - 1]?.remaining_amount
              ? new Intl.NumberFormat("fa-IR", { style: "decimal" })
                  .format(
                    Number(order_obj?.[order_obj.length - 1]?.remaining_amount),
                  )
                  ?.toLocaleString()
              : 0}
            <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCost;
