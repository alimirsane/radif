import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Card } from "@kit/card";
import { useQuery } from "@tanstack/react-query";
import { DateHandler } from "@utils/date-handler";
import { apiGrantRequest } from "@api/service/grant-request";
import { GrantStatusType } from "@api/service/grant-request/type/grant-status-type";
import { useCustomerGrantsManagementHandler } from "@hook/customer-grants-management";

interface ResearchGrantProps {
  onSelectItems: (items: number[]) => void;
  grant_request1: number | null | undefined;
  grant_request2: number | null | undefined;
  is_completed: boolean;
}

const ResearchGrant: React.FC<ResearchGrantProps> = ({
  onSelectItems,
  grant_request1,
  grant_request2,
  is_completed,
}) => {
  const {
    selectedResearchGrants,
    setSelectedResearchGrants,
    isResearchGrantSelected,
    setIsResearchGrantSelected,
  } = useCustomerGrantsManagementHandler();
  const initialSelectedItems = useMemo(() => {
    const items: number[] = [];
    if (grant_request1) items.push(Number(grant_request1));
    if (grant_request2) items.push(Number(grant_request2));
    return items;
  }, [grant_request1, grant_request2]);
  const [isresearchSelected, setIsresearchSelected] = useState<boolean>(
    is_completed ? initialSelectedItems.length > 0 : isResearchGrantSelected,
  );
  const [selectedItems, setSelectedItems] = useState<number[]>(
    selectedResearchGrants,
  );
  const [message, setMessage] = useState<string>("");
  // get grants data
  const {
    data: grants,
    isLoading: grantsLoading,
    refetch,
  } = useQuery(apiGrantRequest().getAll());
  const approvedGrants = useMemo(() => {
    return grants?.data?.filter(
      (grant) => grant.status === GrantStatusType.APPROVED,
    );
  }, [grants]);
  const getGrantsList = useCallback(() => {
    if (is_completed)
      return approvedGrants?.filter(
        (grant) =>
          grant.status === GrantStatusType.APPROVED &&
          initialSelectedItems.includes(grant.id),
      );
    else
      return approvedGrants?.filter(
        (grant) =>
          grant.status === GrantStatusType.APPROVED &&
          Number(grant.remaining_amount) !== 0,
      );
  }, [approvedGrants, is_completed, initialSelectedItems]);

  const totalGrantsAmount = useMemo(() => {
    return Number(
      grants?.data?.reduce(
        (sum, grant) => sum + Number(grant.remaining_amount),
        0,
      ),
    );
  }, [grants]);
  const handleGrantSelection = (grantId: number) => {
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
  // synchronize selected items with the parent component when it changes
  useEffect(() => {
    onSelectItems(selectedItems);
    setSelectedResearchGrants(selectedItems);
  }, [selectedItems, onSelectItems, setSelectedResearchGrants]);

  useEffect(() => {
    if (isresearchSelected) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isresearchSelected]);
  return (
    <div>
      <div className="mt-5 flex items-start md:items-center">
        <input
          checked={isresearchSelected}
          type="checkbox"
          id="isresearchSelected"
          onChange={() => {
            setIsresearchSelected(!isresearchSelected);
            setIsResearchGrantSelected(!isresearchSelected);
            setSelectedItems([]);
            setSelectedResearchGrants([]);
          }}
          name="isresearchSelected"
          disabled={totalGrantsAmount === 0 || !grants || is_completed}
        ></input>
        <label
          htmlFor="isresearchSelected"
          className={`flex flex-col items-center pr-2 text-[15px] font-[500] md:flex-row ${
            (totalGrantsAmount === 0 || !grants) && !is_completed
              ? " text-typography-secondary"
              : ""
          }`}
        >
          دارای گرنت پژوهشی هستم.
          {message && (
            <span className="mx-2 text-[13px] text-error">{message}</span>
          )}
          {(totalGrantsAmount === 0 || !grants) && !is_completed && (
            <span className="mx-1 text-[13px]">
              (گرنت پژوهشی دانشگاه صنعتی شریف برای شما ثبت نشده است.)
            </span>
          )}
        </label>
      </div>
      {isresearchSelected && (
        <div className="grid grid-cols-1 gap-4 pb-2 pt-4 md:grid-cols-2">
          {!getGrantsList()?.length ? (
            <p className="px-5 text-[14px]">گرنتی یافت نشد.</p>
          ) : (
            getGrantsList()?.map((item, index) => (
              <Card
                key={index}
                color="white"
                variant="outline"
                onClick={() => {
                  if (is_completed) return;
                  handleGrantSelection(item.id);
                }}
                className={`relative flex w-full cursor-pointer flex-col gap-4 px-4 pb-5 pt-3 md:flex-row md:items-center md:pb-4 ${selectedItems.includes(item.id) ? " border border-info" : ""}`}
              >
                {selectedItems.indexOf(
                  selectedItems.find?.((grant) => grant === item.id) as number,
                ) !== -1 && (
                  <div className="absolute left-0 top-0 flex h-7 w-7 -translate-x-1/3 -translate-y-1/3 transform items-center justify-center rounded-full bg-info-dark text-[14px] font-bold text-common-white">
                    {selectedItems.indexOf(
                      selectedItems.find?.(
                        (grant) => grant === item.id,
                      ) as number,
                    ) + 1}
                  </div>
                )}
                <div className="flex w-full flex-col gap-[18px] md:w-[50%]">
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
                        disabled={is_completed}
                      ></input>
                    </span>
                    <span className="flex-grow overflow-hidden text-[15px] font-bold">
                      {`${item.receiver_obj.first_name} ${item.receiver_obj.last_name}`}
                    </span>
                  </span>
                  <div className="flex w-full flex-row flex-wrap justify-start gap-1 overflow-hidden text-[14px]">
                    تاریخ انقضا:
                    <span className="font-[500]">
                      {DateHandler.formatDate(item.expiration_date, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 md:w-[50%] md:pt-2">
                  <div className="flex w-full flex-row flex-wrap gap-1 overflow-hidden pb-1 text-[15px] md:justify-end md:gap-0 md:px-4">
                    <span className="md:hidden">مبلغ گرنت: </span>
                    <span className="font-bold text-typography-secondary">
                      {Number(item.approved_amount).toLocaleString()}
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
                      disabled={is_completed}
                      className="ml-2 h-5 w-5 md:hidden"
                    ></input>
                    <div className="flex w-full flex-row flex-wrap items-center justify-between">
                      <h6 className="text-[14px] font-[400]">مبلغ باقیمانده</h6>
                      <span className={`text-[16px] font-[600]`}>
                        {Number(item.remaining_amount).toLocaleString()}
                        <span className="mr-1 text-[13px] font-[400]">
                          (ریال)
                        </span>
                      </span>
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

export default ResearchGrant;
