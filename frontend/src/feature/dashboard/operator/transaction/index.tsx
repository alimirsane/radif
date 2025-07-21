import { useEffect, useMemo, useState } from "react";

import { Card } from "@kit/card";
import Tooltip from "@kit/tooltip";
import { useRouter } from "next/router";
import Badge from "@feature/kits/badge";
import { SvgIcon } from "@kit/svg-icon";
import Pagination from "@kit/pagination";
import { DateHandler } from "@utils/date-handler";
import { useTransactionHandler } from "./transaction";
import Container from "@feature/dashboard/common/container";
import { apiPaymentRecord } from "@api/service/payment-record";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Downloder } from "@feature/dashboard/common/download-file";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import { TransactionPrint } from "@feature/dashboard/common/transaction-print";
import {
  IcAddFile,
  IcCloseLock,
  IcDelete,
  IcEdit,
  IcExcel,
  IcOpenLock,
  IcReceipt,
} from "@feature/kits/common/icons";
import { Button } from "@kit/button";

const Transaction = () => {
  const router = useRouter();
  const settlementTypes = useMemo(() => {
    return [
      { value: "cash", name: "نقدی" },
      { value: "pos", name: "کارتخوان" },
      { value: "iopay", name: "درگاه پرداخت داخلی" },
      { value: "eopay", name: "درگاه پرداخت خارجی" },
    ];
  }, []);
  const clientQuery = useQueryClient();
  const openModal = useModalHandler((state) => state.openModal);
  const statusList = useMemo(() => {
    return [
      { value: "successful1", name: "موفق" },
      { value: "unsuccessful", name: "ناموفق" },
    ];
  }, []);
  const { transaction, setTransaction } = useTransactionHandler();
  const [printRole, setPrintRole] = useState<"customer" | "operator">(
    "operator",
  );
  const [displayLoadingOverlay, setDisplayLoadingOverlay] = useState(true);
  // current page
  const [currentPage, setCurrentPage] = useState(1);
  // get payment records
  const {
    data: paymentsList,
    isLoading: paymentsLoading,
    refetch: refetchList,
  } = useQuery(
    apiPaymentRecord().getAllByOperator({
      invoice_print: true,
      page: currentPage,
      end_date: router.query.end_date,
      start_date: router.query.start_date,
      useLoadingOverlay: displayLoadingOverlay,
    }),
  );

  // number of items per page
  const pageSize = paymentsList?.data?.page_size || 10;
  // number of all items
  const totalTransactions = Number(paymentsList?.data?.count) || 0;
  // total pages
  const totalPages = Math.ceil(totalTransactions / pageSize);
  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  // get transactions for the current page
  const getCurrentPageTransactionsList = () => {
    if (!paymentsList) return [];
    // const startIndex = (currentPage - 1) * pageSize;
    // const endIndex = Math.min(startIndex + pageSize, totalTransactions);
    // return paymentsList.data?.results.slice(startIndex, endIndex);
    return paymentsList.data?.results;
  };
  // get file URL for downloading
  const { data: fileUrl, refetch } = useQuery({
    ...apiPaymentRecord().getFileUrl({ ...router.query, export_excel: true }),
    enabled: false,
  });
  const getFileUrl = async () => {
    // trigger the query to fetch the file URL
    const { data: file } = await refetch();
    // download the file if the URL is available
    if (file?.data.file_url) {
      const link = document.createElement("a");
      link.href = file?.data.file_url;
      link.download = "transactions-list.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  useEffect(() => {
    if (!transaction) {
      return;
    }
    window.print();
    setTransaction(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction]);

  useEffect(() => {
    if (
      router.query.action === "edit" ||
      router.query.action === "add" ||
      router.query.action === "delete"
    ) {
      // refetch data
      refetchList();
      delete router.query.action;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // fetch data every 60 seconds
  useEffect(() => {
    setDisplayLoadingOverlay(false);
    const interval = setInterval(async () => {
      try {
        await refetchList();
      } catch (err) {
        console.error(err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [refetchList]);
  return (
    <>
      <TransactionPrint transaction={transaction} role={printRole} />
      <Container>
        <Card
          id="transaction-operator"
          variant={"outline"}
          className="flex flex-col items-center px-4 py-7 sm:px-9"
        >
          <header className="flex w-full flex-col items-center justify-between pb-6 md:flex-row">
            <span className="flex flex-col">
              <h6 className="text-[18px] font-bold">جزئیات تراکنش‌ها</h6>
              <p className="pt-2 text-[14px]">
                در این بخش می‌توانید لیست تراکنش‌ها را مشاهده کنید.
              </p>
            </span>
          </header>
          <div className="flex w-full flex-col items-center justify-between pb-8 lg:flex-row">
            <span className="w-full lg:w-[70%]">
              <Downloder
                title="دانلود لیست تراکنش‌ها"
                onDownload={getFileUrl}
                onReset={() => {}}
              />
            </span>
            <Button
              variant="outline"
              color="primary"
              className="mt-[23px]"
              onClick={() => openModal(ModalKeys.CONTRADICTION_PAYMENT_RECORDS)}
              startIcon={
                <SvgIcon
                  fillColor={"primary"}
                  className={"[&_svg]:h-[17px] [&_svg]:w-[17px]"}
                >
                  <IcExcel />
                </SvgIcon>
              }
            >
              مغایرت گیری
            </Button>
          </div>
          {/* <div className="mb-8 flex w-full flex-col items-center gap-4 md:flex-row">
            <div className={`w-full md:w-1/4`}>
              <Select
                onItemChange={(selectedItem) => {
                  router.query.status = selectedItem?.value;
                  if (!selectedItem?.value) delete router.query.status;
                  router.replace(router);
                }}
                options={statusList}
                name={"department"}
                label={"مشاهده براساس وضعیت"}
                holder={(activeItem, reset) => (
                  <Card
                    variant={"outline"}
                    className={
                      "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2 text-sm"
                    }
                  >
                    {activeItem ? (
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          reset();
                        }}
                        endIcon={
                          <SvgIcon
                            className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
                          >
                            <CloseIcon />
                          </SvgIcon>
                        }
                        size={"tiny"}
                        color={"primary"}
                        variant={"outline"}
                      >
                        {activeItem?.name}
                      </Button>
                    ) : (
                      <span
                        className={
                          "py-[2px] text-[13px] text-typography-secondary"
                        }
                      >
                        وضعیت تراکنش را انتخاب کنید
                      </span>
                    )}

                    <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                      <IcChevronDown />
                    </SvgIcon>
                  </Card>
                )}
              >
                {(item, activeItem) => (
                  <Button
                    className={"w-full"}
                    variant={
                      activeItem?.value === item?.value ? "outline" : "text"
                    }
                    color={"primary"}
                  >
                    {item?.name}
                  </Button>
                )}
              </Select>
            </div>
            <div className={`w-full md:w-3/4`}>
              <Downloder
                title="دانلود لیست تراکنش‌ها"
                onDownload={getFileUrl}
              />
            </div>
          </div> */}
          {!getCurrentPageTransactionsList().length && (
            <Card color="info" className="w-full p-7 text-center text-[14px]">
              <p>هنوز هیچ پرداختی ثبت نشده است.</p>
            </Card>
          )}
          {!!getCurrentPageTransactionsList().length && (
            <>
              <div className="mb-3 flex w-full flex-nowrap justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] bg-background-paper-dark px-5 py-7 font-bold lg:gap-2 lg:whitespace-normal">
                <div className="w-full lg:w-[11%]">شماره درخواست</div>
                <div className="w-full lg:w-[12%]">درخواست کننده</div>
                <div className="w-full lg:w-[10%]">مبلغ تراکنش</div>
                <div className="w-full lg:w-[10%]">تاریخ تراکنش</div>
                <div className="w-full lg:w-[10%]">شماره تراکنش</div>
                <div className="w-full lg:w-[9%]">کد مرجع</div>
                <div className="w-full lg:w-[12%]">نوع تراکنش</div>
                <div className="w-full lg:w-[14%]">وضعیت</div>
                <div className="flex w-full lg:w-[12%]">
                  {/* چاپ تراکنش */}
                  اقدامات
                </div>
              </div>
              {getCurrentPageTransactionsList()?.map((item, index) => (
                <Card
                  key={index}
                  color={index % 2 === 0 ? "paper" : "white"}
                  variant={index % 2 === 0 ? "flat" : "outline"}
                  className="mb-3 flex w-full flex-nowrap items-center justify-between gap-5 overflow-x-auto whitespace-nowrap rounded-[10px] px-5 py-7 text-[14px] lg:gap-2 lg:overflow-x-visible lg:whitespace-normal"
                >
                  <div className="flex w-full flex-col items-center gap-1 lg:w-[11%]">
                    {item.request_obj?.request_number}
                    {item.payment_type === "prepayment" && (
                      <div>
                        <span
                          className={`whitespace-nowrap rounded-full bg-info bg-opacity-80 px-4 py-1 text-[12px] text-common-white`}
                        >
                          پیش پرداخت
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="w-full lg:w-[12%]">{`${item.payer_obj?.first_name} ${item.payer_obj?.last_name}`}</div>
                  <div className="w-full lg:w-[10%]">
                    {item.amount?.toLocaleString()}
                    {item.amount !== 0 && (
                      <span className="mr-1 text-[12px] font-[400]">
                        (ریال)
                      </span>
                    )}
                  </div>
                  <div className="w-full lg:w-[10%]">
                    {item.updated_at
                      ? DateHandler.formatDate(item.updated_at, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "---"}
                  </div>
                  <div className="w-full lg:w-[10%]">
                    {/* {item.transaction_code ?? "---"} */}
                    {item.tref ?? "---"}
                  </div>
                  <div className="w-full lg:w-[9%]">
                    {item.transaction_code ?? "---"}
                  </div>
                  <div className="w-full lg:w-[12%]">
                    {
                      settlementTypes.find(
                        (type) => type.value === item.settlement_type,
                      )?.name
                    }
                  </div>
                  <div className="flex w-full flex-row gap-2 lg:w-[14%]">
                    <span
                      className={`rounded-full bg-opacity-10 px-4 py-1 text-[14px] ${item.successful ? "bg-success text-success-dark" : "bg-error text-error-dark"}`}
                    >
                      {item.successful ? "موفق" : "ناموفق"}
                    </span>
                    {item.is_returned && (
                      <Badge color="error" className="py-[5px]">
                        استرداد شده
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-row gap-1 lg:w-[12%]">
                    {/* 1 */}
                    {/* {item.successful && (
                      <Button
                        variant="outline"
                        color="primary"
                        onClick={() => {
                          setPrintRole("customer");
                          setTransaction(item);
                        }}
                      >
                        {item.successful
                          ? "چاپ فاکتور مشتری"
                          : "چاپ پیش فاکتور مشتری"}
                      </Button>
                    )} */}

                    {/* 2 */}
                    {/* {item.successful && ( */}
                    {/* <Button
                      variant="outline"
                      color="primary"
                      onClick={() => {
                        setPrintRole("operator");
                        setTransaction(item);
                      }}
                    >
                      {!item.successful ? "پیش فاکتور" : "فاکتور"}
                    </Button> */}
                    {/* {item.order_obj.order_status === "pending" */}
                    {/* )} */}

                    {/* 3 */}

                    <AccessLevel
                      module={"paymentrecord"}
                      permission={["delete"]}
                    >
                      <Tooltip
                        message={
                          item.is_lock ? "باز کردن تراکنش" : "قفل کردن تراکنش"
                        }
                      >
                        <SvgIcon
                          onClick={() =>
                            openModal(ModalKeys.LOCK_PAYMENT_RECORD, item)
                          }
                          fillColor={"primary"}
                          className={
                            "cursor-pointer [&_svg]:h-[21px] [&_svg]:w-[26px]"
                          }
                        >
                          {item.is_lock ? <IcCloseLock /> : <IcOpenLock />}
                        </SvgIcon>
                      </Tooltip>
                    </AccessLevel>
                    <AccessLevel
                      module={"paymentrecord"}
                      permission={["delete"]}
                    >
                      <Tooltip message="ایجاد تراکنش جدید">
                        <SvgIcon
                          onClick={() => {
                            if (item.is_lock) return;
                            openModal(ModalKeys.CREATE_PAYMENT_RECORD, {
                              orderId: item.order,
                              payerId: item.payer,
                              price: item.request_obj?.price,
                            });
                          }}
                          fillColor={"primary"}
                          className={`${item.is_lock ? "cursor-not-allowed opacity-55" : "cursor-pointer"} [&_svg]:h-[23px] [&_svg]:w-[20px]`}
                        >
                          <IcAddFile />
                        </SvgIcon>
                      </Tooltip>
                    </AccessLevel>
                    <AccessLevel
                      module={"paymentrecord"}
                      permission={["update"]}
                    >
                      <Tooltip message="ویرایش">
                        <SvgIcon
                          onClick={() => {
                            if (item.is_lock) return;
                            openModal(ModalKeys.EDIT_PAYMENT_RECORD, item);
                          }}
                          strokeColor={"primary"}
                          className={`${item.is_lock ? "cursor-not-allowed opacity-55" : "cursor-pointer"} [&_svg]:h-[30px] [&_svg]:w-[30px]`}
                        >
                          <IcEdit />
                        </SvgIcon>
                      </Tooltip>
                    </AccessLevel>
                    <AccessLevel
                      module={"paymentrecord"}
                      permission={["delete"]}
                    >
                      <Tooltip message="حذف">
                        <SvgIcon
                          onClick={() => {
                            if (item.is_lock) return;
                            openModal(ModalKeys.DELETE_PAYMENT_RECORD, item);
                          }}
                          fillColor={"primary"}
                          className={`${item.is_lock ? "cursor-not-allowed opacity-55" : "cursor-pointer"} [&_svg]:h-[20px] [&_svg]:w-[23px]`}
                        >
                          <IcDelete />
                        </SvgIcon>
                      </Tooltip>
                    </AccessLevel>
                    <Tooltip
                      message={
                        // item.successful &&
                        // item.request_obj?.latest_status_obj?.step_obj?.name === "در ‌انتظار نمونه"
                        item?.request_obj?.latest_status_obj?.step_obj?.name ===
                          "در انتظار اپراتور" ||
                        item?.request_obj?.latest_status_obj?.step_obj?.name ===
                          "در ‌انتظار پذیرش" ||
                        item?.request_obj?.latest_status_obj?.step_obj?.name ===
                          "در انتظار پرداخت"
                          ? "چاپ پیش فاکتور"
                          : "چاپ فاکتور"
                      }
                    >
                      <SvgIcon
                        onClick={() => {
                          setPrintRole("operator");
                          setTransaction(item);
                        }}
                        fillColor={"primary"}
                        className={
                          "cursor-pointer [&_svg]:h-[20px] [&_svg]:w-[24px]"
                        }
                      >
                        <IcReceipt />
                      </SvgIcon>
                    </Tooltip>
                  </div>
                </Card>
              ))}
            </>
          )}
        </Card>

        {/* Pagination */}
        <div className="mt-8" id="transaction-operator">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </Container>
    </>
  );
};

export default Transaction;
