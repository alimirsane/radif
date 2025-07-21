import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { ModalKeys } from "@utils/modal-handler/config";
import {
  IcAddDocument,
  IcChevronDown,
  IcEdit,
  IcSearch,
} from "@feature/kits/common/icons";
import { Input } from "@kit/input";
import { useDebounce } from "@utils/use-debounce";
import { apiForm } from "@api/service/form";
import Tooltip from "@kit/tooltip";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import { ActionDelete } from "@feature/dashboard/operator/laboratory/common/actions/delete";
import { ActionView } from "@feature/dashboard/operator/laboratory/common/actions/view";
import { Select } from "@kit/select";

const FormsList = () => {
  const router = useRouter();
  const [initialSearchList, setInitialSearchList] = useState<any[]>([]);
  const [isFirstRender, setIsFirstRender] = useState(true);
  // set form search value
  const { value, setValue, debouncedValue } = useDebounce("");
  useEffect(() => {
    if (debouncedValue) {
      router.query.search_form = debouncedValue;
      router.push(router);
    } else {
      delete router.query.search_form;
      router.push(router);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // get forms data
  const {
    data: forms,
    isLoading: formsLoading,
    refetch,
  } = useQuery(apiForm().getAll({ search: router.query.search_form }));

  const formsList = useMemo(() => {
    return forms?.data?.map(({ id, title }) => ({
      value: id?.toString(),
      name: title,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.form]);

  // Set the initial experiments list only on first render
  useEffect(() => {
    if (isFirstRender && forms?.data) {
      const initialList = forms?.data?.map(({ id, title }) => ({
        value: id?.toString(),
        name: title,
      }));
      setInitialSearchList(initialList.reverse());
      setIsFirstRender(false);
    }
  }, [forms, isFirstRender]);
  return (
    <AccessLevel module={"form"} permission={["view"]}>
      <>
        <div className="px-5">
          <AccessLevel module={"form"} permission={["create"]}>
            <div className="mb-8 flex w-full flex-col items-center md:flex-row">
              <div className="w-full md:w-2/5">
                {/* <Input
                  placeholder="نام فرم یا سوال را وارد کنید"
                  label="جستجوی فرم"
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
                /> */}
                <Select
                  options={initialSearchList ?? []}
                  value={value}
                  onItemChange={(activeItem) => {
                    if (activeItem) {
                      setValue(activeItem.name ?? "");
                    } else {
                      delete router.query.search_form;
                      router.push(router);
                    }
                  }}
                  className="w-full"
                  resettable
                  label={"جستجوی فرم"}
                  holder={(activeItem) => (
                    <Card
                      variant={"outline"}
                      className={
                        "mt-2 flex w-full cursor-pointer items-center justify-between px-2 py-2.5 text-sm"
                      }
                    >
                      <span
                        className={
                          activeItem
                            ? "text-typography-main"
                            : "text-[13px] text-typography-secondary"
                        }
                      >
                        {activeItem?.name ?? "نام فرم را انتخاب کنید"}
                      </span>

                      <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                        <IcChevronDown />
                      </SvgIcon>
                    </Card>
                  )}
                  searchOn={"name"}
                  placeholder="جستجو کنید"
                >
                  {(item, activeItem) => (
                    <Button
                      className={"w-full"}
                      variant={
                        item?.value === activeItem?.value ? "solid" : "text"
                      }
                      color={"primary"}
                    >
                      {item?.name}
                    </Button>
                  )}
                </Select>
              </div>
              <div className="mt-8 flex w-full justify-center md:mt-auto md:w-3/5 md:justify-end">
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => {
                    router.query.form = "new";
                    router.push(router);
                  }}
                  startIcon={
                    <SvgIcon
                      fillColor={"white"}
                      className={"[&_svg]:h-[24px] [&_svg]:w-[24px]"}
                    >
                      <IcAddDocument />
                    </SvgIcon>
                  }
                >
                  اضافه کردن فرم
                </Button>
              </div>
            </div>
          </AccessLevel>
          {forms?.data.length === 0 && (
            <Card color="info" className="w-full p-7 text-center text-[14px]">
              <p>فرمی یافت نشد.</p>
            </Card>
          )}
          {forms?.data.length !== 0 && (
            <>
              <div className="my-2 hidden w-full rounded-[10px] bg-background-paper-dark p-7 font-bold md:flex">
                <span className="w-[40%]">نام فرم</span>
                <span className="w-[48%]">نام آزمون</span>
                <span className="w-[12%]">اقدامات</span>
              </div>
              {forms?.data?.toReversed().map((item, index) => (
                <Card
                  key={index}
                  color={index % 2 === 0 ? "paper" : "white"}
                  variant={index % 2 === 0 ? "flat" : "outline"}
                  className="mb-2 flex w-full flex-wrap items-center justify-between gap-4 rounded-[10px] px-7 py-6 text-[14px] md:gap-0"
                >
                  <span className="w-full md:w-[40%]">
                    <span className="font-bold md:hidden">فرم: </span>
                    {item.title}
                  </span>
                  <span className="w-full md:w-[48%]">
                    <span className="font-bold md:hidden">آزمون‌ها:</span>{" "}
                    <span key={index} className="text-[14px]">
                      {Array.isArray(item?.experiment_objs) &&
                      item?.experiment_objs.length !== 0
                        ? item.experiment_objs
                            .map((experiment_obj, index) => experiment_obj.name)
                            .join("، ")
                        : "---"}
                    </span>
                  </span>
                  <span className="flex w-full justify-end gap-2 md:w-[12%] md:justify-normal">
                    <AccessLevel module={"form"} permission={["view"]}>
                      <ActionView
                        item={item}
                        modalKey={ModalKeys.OPERATOR_VIEW_FORM}
                      />
                    </AccessLevel>

                    <AccessLevel module={"form"} permission={["update"]}>
                      <Tooltip message="ویرایش">
                        <SvgIcon
                          onClick={() => {
                            router.query.form = "edit";
                            router.query.formId = item.id.toString();
                            router.push(router);
                          }}
                          strokeColor={"primary"}
                          className={
                            "cursor-pointer [&_svg]:h-[30px] [&_svg]:w-[30px]"
                          }
                        >
                          <IcEdit />
                        </SvgIcon>
                      </Tooltip>
                    </AccessLevel>

                    <AccessLevel module={"form"} permission={["delete"]}>
                      <ActionDelete
                        item={item}
                        modalKey={ModalKeys.OPERATOR_DELETE_FORM}
                      />
                    </AccessLevel>
                  </span>
                </Card>
              ))}
            </>
          )}
        </div>
      </>
    </AccessLevel>
  );
};

export default FormsList;
