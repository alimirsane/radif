import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import * as yup from "yup";

import Form from "./form";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { Collapse } from "@kit/collapse";
import { useFBManufacture } from "@module/form-builder/manufacturer";
import { SvgIcon } from "@kit/svg-icon";
import {
  IcCheck,
  IcChevronDown,
  IcChevronUp,
  IcPlus,
} from "@feature/kits/common/icons";
import { FBElements } from "@module/form-builder/type/element";
import { useMutation } from "@tanstack/react-query";
import { apiForm } from "@api/service/form";
import { ServiceBaseModel } from "@api/config/model/service-base-model";
import { FormType } from "@api/service/form/type";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { Input } from "@kit/input";

const CreateLaboratoryForm = ({
  formTitle,
  createdForm,
}: {
  formTitle: string | undefined;
  createdForm: ServiceBaseModel<FormType> | undefined;
}) => {
  const router = useRouter();
  const formTitleValidationSchema = useMemo(() => {
    return yup.object({
      title: validation.requiredInput,
    });
  }, []);
  //  ****** manufacture ******
  // state management -> get form array
  const form = useFBManufacture((state) => state.form);
  // state management -> create core element
  const createCoreElement = useFBManufacture(
    (state) => state.createCoreElement,
  );

  const initForm = useFBManufacture((state) => state.setInitForm);
  const [expandItem, setExpandItem] = useState<Array<string>>([]);

  const buttonElement = useMemo(() => {
    return {
      id: "button_id",
      grid: "col-span-12",
      name: "submit_button",
      label: "ثبت اطلاعات نمونه",
      element: FBElements.BUTTON,
      readonlyRole: [],
      type: "submit",
      variant: "solid",
    };
  }, []);
  const returnSampleElement = useMemo(() => {
    return {
      id: "return_sample_id",
      grid: "col-span-12 md:col-span-6",
      name: "return_sample",
      label: "آیا قصد عودت نمونه را دارید؟",
      element: FBElements.RADIO_GROUP,
      items: [
        { label: "بله", value: "بله" },
        { label: "خیر", value: "خیر" },
      ],
      value: "خیر",
      readonlyRole: [],
    };
  }, []);
  useEffect(() => {
    initForm(
      createdForm?.data?.json_init ?? [buttonElement],
      // createdForm?.data?.json_init ?? [returnSampleElement, buttonElement],
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdForm]);

  const handleClickOnCollapseItem = (id: string) => () => {
    if (expandItem.includes(id)) {
      setExpandItem((prevState) => prevState.filter((item) => item != id));
    } else {
      setExpandItem((prevState) => [...prevState, id]);
    }
  };
  const handleCollapseOnElementSubmit = (id: string) => () => {
    setExpandItem((prevState) => prevState.filter((item) => item != id));
  };

  const handleAddItem = () => {
    // Generate a random number for the id
    const randomId = Math.floor(Math.random() * 1000000) + 1;
    const newItem = { id: String(randomId) };
    // state management -> add new core element to json
    // todo: check length
    createCoreElement(newItem, form.length - 1);
  };
  const demonstrationForm = useMemo(() => {
    return form
      .filter((item) => item.element !== FBElements.BUTTON)
      .filter((item) => item.id !== "return_sample_id");
  }, [form]);

  // form create api
  const { mutateAsync: createForm } = useMutation(
    apiForm(true, {
      success: "ایجاد فرم موفقیت آمیز بود",
      fail: "ایجاد فرم انجام نشد",
      waiting: "در حال انتظار",
    }).create(),
  );
  // form update api
  const formId = useMemo(() => {
    return router.query.formId as string;
  }, [router]);

  const { mutateAsync: updateForm } = useMutation(
    apiForm(true, {
      success: "ویرایش فرم موفقیت آمیز بود",
      fail: "ویرایش فرم انجام نشد",
      waiting: "در حال انتظار",
    }).update(formId),
  );

  const updateJson = (title: string) => {
    updateForm({
      title: title,
      json_init: JSON.stringify(
        form.filter((item) => item.hasOwnProperty("element")),
      ),
    })
      .then((res) => {
        router.query.form = "display";
        router.push(router);
      })
      .catch((err) => {});
  };

  const createJson = (title: string) => {
    // send form -> create form api
    createForm({
      title: title,
      json_init: JSON.stringify(
        form.filter((item) => item.hasOwnProperty("element")),
      ),
    })
      .then((res) => {
        const formId = res?.data.id;
        router.query.form = "display";
        router.query.formId = formId ? formId.toString() : "";
        router.push(router);
      })
      .catch((err) => {});
  };
  const submitForm = (values: { title: string | undefined }) => {
    if (router.query.form === "create") {
      createJson(values.title ?? "فرم");
    }
    if (router.query.form === "edit") {
      updateJson(values.title ?? "فرم");
    }
  };

  return (
    <div className="px-4 py-1">
      <div className="pb-8">
        {createdForm?.data?.title ? (
          <FormHandler
            id="edit-form"
            validationSchema={formTitleValidationSchema}
            initialValues={{ title: createdForm?.data?.title }}
            handleSubmit={(values, utils) => {
              updateJson(values.title ?? "فرم");
            }}
          >
            {(formik) => (
              <Input
                placeholder="مثلا: پذیرش نمونه XRD ..."
                label="عنوان فرم"
                className="w-full md:w-1/2"
                name={"title"}
                formik={formik}
                autoComplete={"title"}
              />
            )}
          </FormHandler>
        ) : (
          <>
            <h6 className="text-[18px] font-bold">{formTitle}</h6>
            <p className="pt-2 text-[14px]">
              برای ساخت فرم {formTitle}، ابتدا سوال‌های موردنظر خود را ایجاد
              کرده و سپس فرم را ثبت نمایید.
            </p>
          </>
        )}
      </div>
      {demonstrationForm.map((item, index) => {
        const originalIndex = form.findIndex(
          (formItem) => formItem.id === item.id,
        );
        return (
          <Card
            className="mb-2 flex flex-col border border-background-paper-dark"
            key={item.id}
            color={"paper"}
          >
            <div
              className={
                "flex cursor-pointer flex-row items-center justify-between px-4 py-2"
              }
              onClick={handleClickOnCollapseItem(item.id ?? "")}
            >
              <h6 className="text-[15px] font-[700] md:text-[18px]">
                سوال {originalIndex + 1}
                {(item as any)?.label ? `: ${(item as any)?.label}` : ""}
              </h6>
              <SvgIcon className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}>
                {expandItem.includes(item.id ?? "") ? (
                  <IcChevronUp />
                ) : (
                  <IcChevronDown />
                )}
              </SvgIcon>
            </div>
            <Collapse
              open={expandItem.includes(item.id ?? "")}
              // open={
              //   (expandItem.length && expandItem.includes(item.id ?? "")) ||
              //   (!expandItem.length && demonstrationForm.length - 1 === index)
              // }
            >
              <Card
                color={"white"}
                className={"flex flex-col gap-8 px-4 py-10"}
              >
                <Form
                  element={item}
                  formId={item.id}
                  closeCollapse={handleCollapseOnElementSubmit(item.id ?? "")}
                />
              </Card>
            </Collapse>
          </Card>
        );
      })}
      <div className="flex flex-col justify-center gap-4 pt-4">
        <Card
          className="flex w-full cursor-pointer flex-row items-center justify-center p-4"
          color={"primary"}
          onClick={handleAddItem}
        >
          <SvgIcon
            fillColor="primary"
            className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
          >
            <IcPlus />
          </SvgIcon>
          <span className="pr-2 font-bold text-primary">
            ایجاد سوال
            {demonstrationForm.length === 0 ||
            demonstrationForm.every((item) => item.element === "button")
              ? ""
              : " بعدی"}
          </span>
        </Card>
        {demonstrationForm.some((item) => "element" in item) &&
          demonstrationForm.length !== 0 && (
            <Button
              variant="solid"
              color="primary"
              type={router.query.form === "edit" ? "submit" : "button"}
              form="edit-form"
              className="mx-auto"
              startIcon={
                <SvgIcon
                  strokeColor={"white"}
                  className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
                >
                  <IcCheck />
                </SvgIcon>
              }
              onClick={() => {
                if (router.query.form === "create") {
                  createJson(formTitle ?? "فرم");
                }
              }}
            >
              ثبت نهایی فرم
            </Button>
          )}
      </div>
    </div>
  );
};

export default CreateLaboratoryForm;
