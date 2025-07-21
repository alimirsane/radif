import { LabelCard } from "@kit/label-card";
import React, { useEffect, useMemo } from "react";
import { CustomerProfileSamplesType } from "../../type";
import { useRouter } from "next/router";
import SampleCard from "./sample";
import { Card } from "@kit/card";
import { useShowSampleHandler } from "./show-sample";
import { RequestTypeForm } from "@api/service/request/type";
import Barcode from "react-barcode";
import Badge from "@feature/kits/badge";
import { useCurrentRequestHandler } from "@hook/current-request-handler";

interface SampleProps {
  samples: Array<RequestTypeForm> | undefined;
  requestId: string | undefined;
  status: string | undefined;
  is_sample_returned: boolean;
}

const Samples: React.FC<SampleProps> = ({
  samples,
  requestId,
  status,
  is_sample_returned,
}) => {
  const { sample, setSample } = useShowSampleHandler();

  const router = useRouter();
  const flattenedForms = useMemo(() => {
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
    return samples?.flatMap(flattenForm) || [];
  }, [samples]);

  // current child request id
  const { childRequestId, setChildRequestId } = useCurrentRequestHandler();

  useEffect(() => {
    setSample(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, childRequestId]);
  return (
    <div id="print-samples-hide">
      {/* <h3 className="pb-[4px] pt-[24px] text-[18px] font-bold text-typography-gray"> */}
      {/* مشخصات نمونه‌ها */}
      {/* {samples?.length} */}
      {/* {samples
          ?.filter((sample) => sample.is_main)
          ?.reduce((accumulator, item) => {
            const responseCount = item?.response_count ?? 0;
            return accumulator + (responseCount === 0 ? 1 : responseCount);
          }, 0)} */}
      {/* </h3> */}
      <h3 className="back-gray flex flex-row items-center gap-3 pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        مشخصات نمونه‌ها
        {is_sample_returned && (
          <span id="print-is-returned-badge">
            <Badge color="warning" className="bg-opacity-80 py-[5px]">
              عودت نمونه
            </Badge>
          </span>
        )}
      </h3>
      {!!samples?.length && (
        <p className="pb-[16px] text-[14px]">
          با انتخاب نمونه‌ها می‌توانید اطلاعات آن‌ها را مشاهده کنید.
        </p>
      )}
      <Card className="2xl:grid-cols-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {flattenedForms
          // ?.filter((sample) => sample.is_main)
          ?.map((sample, index: number) => (
            <>
              {/* <SampleCard sample={sample} key={index}/> */}
              <LabelCard
                key={index}
                active={sample?.id.toString() === sample?.id.toString()}
                className="cursor-pointer"
                onClick={() => setSample(sample)}
              >
                <span className={"text-[14px]"}>
                  <span className="font-bold">کد نمونه {index + 1}: </span>
                  {sample.form_number}
                </span>
              </LabelCard>
            </>
          ))}
      </Card>
      {sample && (
        // <Card
        //   className="mt-4 flex flex-col items-stretch gap-[16px] bg-opacity-70 p-[24px] sm:flex-row"
        //   color="paper"
        // >
        //   <div
        //     className={`${
        //       status === "در حال انجام" ||
        //       status === "در ‌انتظار نمونه" ||
        //       status === "تکمیل شده"
        //         ? "sm:w-[65%]"
        //         : "sm:w-[100%]"
        //     } flex h-full w-full flex-col self-stretch`}
        //   >
        //     <SampleCard sample={sample} />
        //   </div>
        //   {(status === "در حال انجام" ||
        //     status === "در ‌انتظار نمونه" ||
        //     status === "تکمیل شده") && (
        //     <div className="flex h-full w-full items-center justify-center rounded-[8px] bg-common-white p-2 sm:w-[35%]">
        //       <Barcode value={sample.form_number?.replace(/-/g, "")} />
        //     </div>
        //   )}
        // </Card>
        <Card
          className={`mt-4 grid grid-cols-1 items-stretch gap-[16px] bg-opacity-70 p-[24px] ${
            status === "در حال انجام" ||
            status === "در ‌انتظار نمونه" ||
            status === "تکمیل شده"
              ? "sm:grid-cols-[65%_33%]"
              : "sm:grid-cols-[100%_0%]"
          }`}
          color="paper"
        >
          <div className="flex h-full items-center rounded-[8px] bg-common-white">
            <SampleCard sample={sample} />
          </div>
          {(status === "در حال انجام" ||
            status === "در ‌انتظار نمونه" ||
            status === "تکمیل شده") && (
            <div className="flex h-full items-center justify-center rounded-[8px] bg-common-white p-2">
              <Barcode value={sample.form_number?.replace(/-/g, "")} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Samples;
