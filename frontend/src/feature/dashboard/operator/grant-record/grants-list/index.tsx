import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { GrantRecordType } from "@api/service/grant-record/type";
import { Input } from "@kit/input";
import {
  IcAddDocument,
  IcDelete,
  IcEdit,
  IcExcel,
  IcSearch,
} from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useDebounce } from "@utils/use-debounce";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Tooltip from "@kit/tooltip";
import { DateHandler } from "@utils/date-handler";

const GrantsList = ({ grantRecords }: { grantRecords: GrantRecordType[] }) => {
  const router = useRouter();
  const openModal = useModalHandler((state) => state.openModal);

  const handleOpenModal =
    (modal: ModalKeys, grant: GrantRecordType | undefined) => () => {
      openModal(modal, grant);
    };

  // set lab search value
  const { value, setValue, debouncedValue } = useDebounce("");
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_grant = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_grant;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  return (
    <div>
      {/* <AccessLevel module={"grant"} permission={["create"]}> */}
      <div className="mb-8 flex w-full flex-col items-center md:flex-row">
        <div className="w-full md:w-2/5">
          <Input
            placeholder="نام گرنت را وارد کنید"
            label="جستجوی گرنت"
            value={value}
            className="w-full"
            onChange={(e) => setValue(e.target.value)}
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
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-4 md:mt-auto md:w-3/5 md:flex-row md:justify-end">
          <Button
            variant="outline"
            color="primary"
            onClick={handleOpenModal(
              ModalKeys.OPERATOR_CREATE_GROUP_GRANT_LIST,
              undefined,
            )}
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[22px] [&_svg]:w-[17px]"}
              >
                <IcExcel />
              </SvgIcon>
            }
          >
            اضافه کردن لیست گروهی
          </Button>
          <Button
            variant="solid"
            color="primary"
            onClick={handleOpenModal(
              ModalKeys.OPERATOR_CREATE_GRANT,
              undefined,
            )}
            startIcon={
              <SvgIcon
                fillColor={"white"}
                className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
              >
                <IcAddDocument />
              </SvgIcon>
            }
          >
            اضافه کردن گرنت
          </Button>
        </div>
      </div>
      {/* </AccessLevel> */}
      {!grantRecords.length && (
        <Card color="info" className="w-full p-7 text-center text-[14px]">
          <p>شما هنوز هیچ گرنتی ثبت نکرده‌اید.</p>
        </Card>
      )}
      {!!grantRecords.length && (
        <>
          <Card
            className="flex w-full flex-nowrap justify-between gap-6 overflow-x-auto whitespace-nowrap bg-background-paper-dark px-4 py-7 
        font-bold md:px-[40px] lg:gap-2 lg:whitespace-normal"
          >
            <span className="w-full lg:w-[24%]">عنوان</span>
            <span className="w-full lg:w-[24%]">دریافت کننده</span>
            <span className="w-full lg:w-[24%]">اعتبار</span>
            <span className="w-full lg:w-[24%]">تاریخ انقضا</span>
            <span className="w-full lg:w-[8%]">اقدامات</span>
          </Card>
          {grantRecords?.toReversed().map((grant, index) => (
            <Card
              key={index}
              color={index % 2 === 0 ? "paper" : "white"}
              variant={index % 2 === 0 ? "flat" : "outline"}
              className="mt-[16px] flex w-full flex-nowrap items-center justify-between gap-6 overflow-x-auto
          whitespace-nowrap px-4 py-[24px] md:px-[40px] lg:gap-2 lg:overflow-x-visible lg:whitespace-normal"
            >
              <span className="w-full lg:w-[24%]">{grant.title}</span>
              <span className="w-full lg:w-[24%]">{`${grant.receiver_obj.first_name} ${grant.receiver_obj.last_name}`}</span>
              <span className="w-full lg:w-[24%]">
                {grant?.amount?.toLocaleString()}
                {grant.amount !== 0 && (
                  <span className="mr-1 text-[12px] font-[400]">(ریال)</span>
                )}
              </span>
              {/* <span className="w-full lg:w-[17%]">
                {grant.created_at
                  ? DateHandler.formatDate(grant.created_at, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </span> */}
              <span className="w-full lg:w-[24%]">
                {grant.expiration_date
                  ? DateHandler.formatDate(grant.expiration_date, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : "---"}
              </span>
              <span className="flex w-full gap-2 text-[14px] lg:w-[8%]">
                {/* <AccessLevel module={"grant"} permission={["update"]}> */}
                <Tooltip message="ویرایش">
                  <SvgIcon
                    onClick={handleOpenModal(
                      ModalKeys.OPERATOR_EDIT_GRANT,
                      grant,
                    )}
                    strokeColor={"primary"}
                    className={
                      "cursor-pointer [&_svg]:h-[30px] [&_svg]:w-[30px]"
                    }
                  >
                    <IcEdit />
                  </SvgIcon>
                </Tooltip>
                {/* </AccessLevel> */}
                {/* <AccessLevel module={"parameter"} permission={["delete"]}> */}
                <Tooltip message="حذف">
                  <SvgIcon
                    onClick={handleOpenModal(
                      ModalKeys.OPERATOR_DELETE_GRANT,
                      grant,
                    )}
                    fillColor="primary"
                    className={
                      "cursor-pointer [&_svg]:h-[22px] [&_svg]:w-[22px]"
                    }
                  >
                    <IcDelete />
                  </SvgIcon>
                </Tooltip>
                {/* </AccessLevel> */}
              </span>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default GrantsList;
