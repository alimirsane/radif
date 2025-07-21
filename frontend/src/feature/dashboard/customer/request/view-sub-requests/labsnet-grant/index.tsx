import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Card } from "@kit/card";
import Badge from "@feature/kits/badge";
import { apiUser } from "@api/service/user";
import { apiRequest } from "@api/service/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCustomerGrantsManagementHandler } from "@hook/customer-grants-management";
import { ref } from "yup";

const LabsnetGrant = ({
  onSelectItems,
  isLabsnet,
  labsnet_code1,
  labsnet_code2,
  labsnetMessage,
}: {
  onSelectItems: (items: string[]) => void;
  labsnetMessage: (msg: boolean) => void;
  isLabsnet: boolean | undefined;
  labsnet_code1: string;
  labsnet_code2: string;
}) => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  const {
    selectedLabsnetGrants,
    setSelectedLabsnetGrants,
    isLabsnetGrantSelected,
    setIsLabsnetGrantSelected,
  } = useCustomerGrantsManagementHandler();
  // labsnet checkbox
  const [isLabsnetSelected, setIsLabsnetSelected] = useState<boolean>(
    isLabsnetGrantSelected,
  );
  // checked itmes
  const [selectedItems, setSelectedItems] = useState<string[]>(() => {
    if (selectedLabsnetGrants.length > 0) {
      return selectedLabsnetGrants;
    } else {
      const items = [];
      if (labsnet_code1) items.push(labsnet_code1);
      if (labsnet_code2) items.push(labsnet_code2);
      return items;
    }
  });
  // set message for selected grants number
  const [message, setMessage] = useState<string>("");
  // set messge when labsnet is checked but no grants are selected
  const [isLabsnetMessage, setIsLabsnetMessage] = useState(false);
  // sample credits for development
  const credits = useMemo(() => {
    return process.env.NEXT_PUBLIC_API_DOMAIN === "http://slims.2tica.ir/v1"
      ? [
          {
            id: "101",
            amount: "100,000,000",
            start_date: "1403/05/23",
            end_date: "1403/12/29",
            remain: "78,000,000",
            percent: "100",
            title: "اعتبار ویژه تست برگزیدگان بنیاد ملی نخبگان 1",
          },
          {
            id: "102",
            amount: "50,000,000",
            start_date: "1403/05/01",
            end_date: "1403/12/01",
            remain: "40,000,000",
            percent: "50",
            title: "اعتبار ویژه برگزیدگان بنیاد ملی نخبگان تست 2",
          },
          {
            id: "103",
            amount: "600,000,000",
            start_date: "1403/01/01",
            end_date: "1403/12/29",
            remain: "35,000,000",
            percent: "100",
            title: "اعتبار ویژه تست برگزیدگان بنیاد ملی نخبگان 3",
          },
        ]
      : [];
  }, []);
  // set labsnet grant
  const { mutateAsync: labsnetMutation } = useMutation(
    apiRequest(false).selectLabsnet(Number(router.query.request)),
  );
  // get my labsnet grants list
  const {
    data: myLabsnetGrants,
    isLoading: myLabsnetGrantsLoading,
    refetch,
  } = useQuery(apiUser().getMyLabsnetGrants());
  // set default value for grants if data is empty
  const grantsList = useMemo(() => {
    return myLabsnetGrants?.data?.labsnet_result?.credits ?? credits;
  }, [myLabsnetGrants?.data?.labsnet_result?.credits, credits]);
  // handle selected items
  const handleGrantSelection = (grantId: string) => {
    setMessage("");
    if (selectedItems.includes(grantId)) {
      // If already selected, remove the grant from the selection
      setSelectedItems(selectedItems.filter((id) => id !== grantId));
    } else if (selectedItems.length < 2) {
      // Allow adding a grant if less than 2 grants are selected
      setSelectedItems([...selectedItems, grantId]);
    } else {
      // If user tries to select more than 2, show a message
      setMessage("حداکثر دو گرنت را می‌توانید انتخاب کنید.");
    }
  };
  // set labsent on checkbox change
  const handleCheckboxChange = () => {
    const newIsLabsnetSelected = !isLabsnetSelected;
    setIsLabsnetSelected(newIsLabsnetSelected);
    setIsLabsnetGrantSelected(newIsLabsnetSelected);
    if (!newIsLabsnetSelected) {
      setSelectedItems([]);
      setSelectedLabsnetGrants([]);
    }
    const data = {
      labsnet: newIsLabsnetSelected,
    };
    labsnetMutation(data)
      .then(() => {
        // clientQuery.invalidateQueries({
        //   queryKey: [apiRequest().url],
        // });
      })
      .catch((err) => {});
  };
  // synchronize selected items with the parent component when it changes and update store
  useEffect(() => {
    onSelectItems(selectedItems);
    setSelectedLabsnetGrants(selectedItems);
  }, [selectedItems, onSelectItems, setSelectedLabsnetGrants]);
  // set error message and disable request submit button if labsnet is checked but labsnet name is empty
  useEffect(() => {
    if (isLabsnetSelected && selectedItems.length === 0) {
      labsnetMessage(true);
      setIsLabsnetMessage(true);
    } else {
      labsnetMessage(false);
      setIsLabsnetMessage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLabsnetSelected, selectedItems]);
  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <div className="flex items-start md:items-center">
        <input
          checked={isLabsnetSelected}
          type="checkbox"
          id="isLabsnetSelected"
          onChange={() => {
            handleCheckboxChange();
          }}
          name="isLabsnetSelected"
          disabled={!grantsList?.length}
        ></input>
        <label
          htmlFor="isLabsnetSelected"
          className={`flex flex-col items-center pr-2 text-[15px] font-[500] md:flex-row ${
            !grantsList?.length ? " text-typography-secondary" : ""
          }`}
        >
          دارای گرنت شبکه راهبردی (لبزنت) هستم.
          {isLabsnetMessage && !message && (
            <span className="mx-2 text-[13px] text-error">
              گرنت لبزنت مورد نظر خود را انتخاب نمایید.
            </span>
          )}
          {message && (
            <span className="mx-2 text-[13px] text-error">{message}</span>
          )}
          {!grantsList?.length && (
            <span className="mx-1 text-[13px]">
              (گرنت لبزنت فعالی برای شما یافت نشد.)
            </span>
          )}
        </label>
      </div>
      {isLabsnetSelected && (
        <div className="grid grid-cols-1 gap-4 pb-2 pt-4 md:grid-cols-2">
          {!grantsList?.length ? (
            <p className="px-5 text-[14px]">گرنتی یافت نشد.</p>
          ) : (
            grantsList?.map((item, index) => (
              <Card
                key={index}
                color="white"
                variant="outline"
                onClick={() => {
                  // if (is_completed) return;
                  handleGrantSelection(item.id);
                }}
                className={`relative flex w-full cursor-pointer flex-col gap-4 px-4 py-5 md:items-center md:pb-4 ${selectedItems.includes(item.id) ? " border border-info" : ""}`}
              >
                {selectedItems.indexOf(
                  selectedItems.find?.((grant) => grant === item.id) as any,
                ) !== -1 && (
                  <div className="absolute left-0 top-0 flex h-7 w-7 -translate-x-1/3 -translate-y-1/3 transform items-center justify-center rounded-full bg-info-dark text-[14px] font-bold text-common-white">
                    {selectedItems.indexOf(
                      selectedItems.find?.((grant) => grant === item.id) as any,
                    ) + 1}
                  </div>
                )}
                <div className="flex w-full flex-row">
                  <span className="flex flex-row items-center gap-2">
                    <span className="hidden pt-1 md:block">
                      {/* checkbox for md size */}
                      <input
                        type="checkbox"
                        color="primary"
                        name={`grant${index}`}
                        className="h-4 w-4 text-primary"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleGrantSelection(item.id)}
                        // disabled={is_completed}
                      ></input>
                    </span>
                    <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[15px] font-bold">
                      {item.title}
                    </span>
                  </span>
                </div>
                <div className="flex w-full flex-col md:flex-row">
                  <div className="flex w-full flex-col gap-[14px] md:w-[50%] md:pt-[2px]">
                    <span className="flex flex-row items-center gap-2">
                      <span className="flex flex-grow flex-row items-center gap-2 overflow-hidden text-[14px]">
                        میزان تخفیف:
                        <Badge
                          color="primary"
                          className="bg-opacity-15 px-3 pt-[6px] text-[13px] font-bold text-primary"
                        >
                          {item.percent}%
                        </Badge>
                      </span>
                    </span>
                    <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                      تاریخ انقضا:
                      <span className="font-[500]">{item.end_date}</span>
                    </div>
                  </div>
                  <div className="md:pt-auto flex flex-col gap-2 pt-4 md:w-[50%]">
                    <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                      <span className="md:hidden">مبلغ گرنت: </span>
                      <span className="font-bold text-typography-secondary">
                        {item.amount}
                        <span className="mr-1 text-[13px] font-[400]">
                          (ریال)
                        </span>
                      </span>
                    </div>
                    <div className="flex w-full flex-row items-center rounded-[8px] bg-background-paper bg-opacity-80 px-4 py-2">
                      {/* checkbox for sizes smaller than md */}
                      <input
                        type="checkbox"
                        name={`grant${index}`}
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleGrantSelection(item.id)}
                        // disabled={is_completed}
                        className="ml-2 h-5 w-5 md:hidden"
                      ></input>
                      <div className="flex w-full flex-row flex-wrap items-center justify-between">
                        <h6 className="text-[14px] font-[400]">
                          مبلغ باقیمانده
                        </h6>
                        <span className={`text-[16px] font-[600]`}>
                          {item.remain}
                          <span className="mr-1 text-[13px] font-[400]">
                            (ریال)
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LabsnetGrant;
