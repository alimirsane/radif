import React from "react";
import { Card } from "@kit/card";
import { LabelCard } from "@kit/label-card";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { useParams } from "next/navigation";
import { FBSimpleLoader } from "@module/form-builder/simple-loader";
import Barcode from "react-barcode";
import SampleCard from "@feature/dashboard/operator/component/template/components/samples/sample";
import Badge from "@feature/kits/badge";
import { RequestTypeForm } from "@api/service/request/type";

const SampleInformation = () => {
  const router = useRouter();
  const params = useParams();
  const { data } = useQuery(
    apiRequest().getById(params?.id ? params?.id.toString() : ""),
  );
  const samplesFlattenedForms = useMemo(() => {
    // Recursive function to flatten forms
    const flattenForm = (
      form: RequestTypeForm,
    ): Pick<RequestTypeForm, "id" | "form_number" | "response_json">[] => {
      // Flatten the current form and its children
      const currentForm = {
        id: form.id,
        form_number: form.form_number,
        response_json: form.response_json,
      };
      const childrenForms = form.children?.flatMap(flattenForm) || [];
      // Return the current form along with all its flattened children
      return [currentForm, ...childrenForms];
    };
    // Flatten all the forms in the samples array
    return data?.data?.forms.flatMap(flattenForm) || [];
  }, [data?.data]);

  const sample = useMemo(() => {
    return samplesFlattenedForms.find(
      (sample) => sample.id.toString() == router.query.sample,
    );
  }, [router.query.sample, samplesFlattenedForms]);

  return (
    <div className="mt-[32px]">
      <h2 className="flex flex-row items-center gap-3 pb-2 text-[19px] font-bold text-typography-gray lg:text-[22px]">
        اطلاعات نمونه
        {data?.data?.is_sample_returned && (
          <span id="print-is-returned-badge">
            <Badge color="warning" className="bg-opacity-80 py-[5px]">
              عودت نمونه
            </Badge>
          </span>
        )}
      </h2>
      {!!data?.data?.forms.length && (
        <p className="text-[14px] lg:pt-2">
          با انتخاب نمونه‌ها می‌توانید اطلاعات آن‌ها را مشاهده کنید.
        </p>
      )}
      <Card color={"white"} className="py-3 text-typography-main lg:p-[24px] ">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {data?.data?.forms.length ? (
            samplesFlattenedForms
              // .filter((sample) => sample.is_main)
              .map((form, index) => (
                <LabelCard
                  key={index}
                  active={form.id.toString() == router.query.sample}
                  className={
                    form.id.toString() !== router.query.sample
                      ? "cursor-pointer"
                      : ""
                  }
                  onClick={() => {
                    router.query.sample = form.id.toString();
                    router.replace(router);
                  }}
                >
                  <span className="font-bold">کد نمونه {index + 1}: </span>
                  {form.form_number}
                </LabelCard>
              ))
          ) : (
            <Card color={"info"} className="w-full">
              <p className="p-[16px] text-center text-[14px]">
                موردی یافت نشد.
              </p>
            </Card>
          )}
        </div>
        {sample && (
          <Card
            className="mt-4 flex items-center gap-[16px] bg-opacity-70 p-[24px]"
            color="paper"
          >
            <div className="w-full">
              <SampleCard sample={sample} />
            </div>
            {/* <div className="flex w-[35%] items-center justify-center rounded-[8px] bg-common-white py-4">
              <Barcode value={sample.form_number?.replace("-", "")} />
            </div> */}
          </Card>
        )}
      </Card>
    </div>
  );
};

export default SampleInformation;
