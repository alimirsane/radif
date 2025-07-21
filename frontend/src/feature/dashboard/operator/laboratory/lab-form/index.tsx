import * as yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

import { Card } from "@kit/card";
import CreateLaboratoryForm from "./create-form";
import DisplayForm from "./display-form";
import { apiForm } from "@api/service/form";
import { validation } from "@utils/form-handler/validation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import FormsList from "../forms-list";
import FormStart from "./new-form";
import { Button } from "@kit/button";
import { IcArrowRight } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";

const LaboratoryForm = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();

  const createForm = () => {
    router.query.form = "create";
    router.push(router);
  };

  // get form data
  const formId = Array.isArray(router.query.formId)
    ? router.query.formId[0]
    : router.query.formId;

  const { data: form, isLoading: formLoading } = useQuery(
    apiForm().getById(formId ?? ""),
  );
  const [formTitle, setFormTitle] = useState("");
  useEffect(() => {
    // refetch data based on router query
    clientQuery.invalidateQueries({
      queryKey: [apiForm().url],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.form]);

  const formTitleValidationSchema = useMemo(() => {
    return yup.object({
      title: validation.requiredInput,
    });
  }, []);
  useEffect(() => {
    // set initial router query
    // router.push({
    //   pathname: router.pathname,
    //   query: { step: "5", form: "list" },
    // });
  }, []);
  return (
    <>
      <Card className="border-2 border-info border-opacity-10 px-1 py-5 md:px-4 md:py-8">
        {router.query.form === "new" && (
          <FormStart
            formTitleValidationSchema={formTitleValidationSchema}
            setFormTitle={setFormTitle}
            createForm={createForm}
          />
        )}
        {(router.query.form === "create" || router.query.form === "edit") && (
          <CreateLaboratoryForm
            formTitle={form?.data?.title ?? formTitle}
            createdForm={form}
          />
        )}
        {router.query.form === "display" && <DisplayForm form={form} />}
        {(!router.query.form || router.query.form === "list") && <FormsList />}
      </Card>
      {router.query.form && router.query.form !== "list" && (
        <div className="flex justify-end pt-5">
          <Button
            className="w-full sm:w-auto"
            startIcon={
              <SvgIcon
                fillColor={"primary"}
                className={"[&_svg]:h-[16px] [&_svg]:w-[16px]"}
              >
                <IcArrowRight />
              </SvgIcon>
            }
            variant="outline"
            onClick={() => {
              router.query.form = "list";
              delete router.query.formId;
              router.push(router);
            }}
          >
            بازگشت به لیست فرم‌ها
          </Button>
        </div>
      )}
    </>
  );
};

export default LaboratoryForm;
