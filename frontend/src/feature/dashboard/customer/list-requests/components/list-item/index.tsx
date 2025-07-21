import { Card } from "@kit/card";
import { Collapse } from "@kit/collapse";
import { twMerge } from "tailwind-merge";
import OpenListItem from "./open-list-item";
import { ListItemType } from "../../types";
import { routes } from "../../../../../../data/routes";
import { MouseEventHandler } from "react";
import { useRouter } from "next/router";
import ChildItem from "../child-request";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";
import RequestCost from "../parent-request-cost";

const ListItem = (
  props: ListItemType & {
    cancelRequest: (() => void) | undefined;
  },
) => {
  const { className, onClick, item, expandItem, cancelRequest } = props;

  const openModal = useModalHandler((state) => state.openModal);
  const router = useRouter();

  return (
    <Card
      variant={"outline"}
      color={"white"}
      className={twMerge(
        "p-[12px] text-[14px] text-typography-main transition-all duration-500 hover:shadow-md lg:border-0 lg:p-0 hover:lg:shadow-none",
        className,
      )}
    >
      <div>
        <OpenListItem
          request={item}
          onClick={onClick}
          cancelRequest={cancelRequest}
        />
      </div>

      <Collapse open={expandItem.includes(item.id ?? -1)} className="w-full">
        <div className="mt-[12px] border-t-[1px] border-common-black/10 pt-6 lg:mt-[8px] lg:gap-[20px] lg:rounded-[12px] lg:border-[1px] lg:px-[34px] lg:pb-5 lg:pt-8">
          <RequestCost request={props.item} />
          {props.item?.child_requests?.map((child, index) => (
            <ChildItem
              className={"my-[14px]"}
              onClick={() => {
                router.push({
                  pathname: routes.customerRequestsDetails(
                    child.id?.toString(),
                  ),
                  query: {},
                });
              }}
              cancelRequest={() => {
                openModal(ModalKeys.REJECT_REQUEST, {
                  requestId: child.id,
                  appointmentsObj: child.appointments_obj,
                  type: "child_request",
                });
              }}
              expandItem={expandItem}
              item={child}
              key={index}
            />
          ))}
        </div>
        {/* <div className="mt-[12px] border-t-[1px] border-common-black/10 pt-[12px] lg:mt-[8px] lg:grid lg:grid-cols-2 lg:gap-[20px] lg:rounded-[12px] lg:border-[1px] lg:p-[16px]">
          <Card
            className={
              "bg-background-paper-light/70 px-[12px] py-[16px] lg:bg-common-white lg:p-0"
            }
          >
            <h5 className="mb-[8px] text-[16px] font-bold text-typography-main lg:hidden">
              نمونه‌ها
            </h5>
            <div className="flex gap-[10px] lg:grid lg:grid-cols-3">
              {item?.forms.length ? (
                samplesFlattenedForms
                  // .filter((sample) => sample.is_main)
                  .map((form, index) => (
                    <LabelCard className={"w-full"} key={index} active>
                      <span className="font-bold">کد نمونه {index + 1}: </span>
                      {form.form_number}
                    </LabelCard>
                  ))
              ) : (
                <p className="pt-4">نمونه‌ای ثبت نشده است.</p>
              )}
            </div>
          </Card>
          <div>
            <Content
              status={props.item?.latest_status_obj?.step_obj.name}
              price={props.item.price}
              requestId={props.item.id}
              item={props.item}
            />
          </div>
          <Link
            href={routes.customerRequestsDetails(props.item.id?.toString())}
          >
            <Button variant={"outline"} className="mt-2 lg:mt-auto">
              نمایش جزئیات بیشتر
            </Button>
          </Link>
        </div> */}
      </Collapse>
    </Card>
  );
};

export default ListItem;
