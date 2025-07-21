import { RequestTypeForm } from "@api/service/request/type";
import Badge from "@feature/kits/badge";
import { FBSimpleLoader } from "@module/form-builder/simple-loader";
import React, { useMemo } from "react";
import Barcode from "react-barcode";

interface SampleProps {
  samples: Array<RequestTypeForm> | undefined;
  requestId: string | undefined;
  status: string | undefined;
  is_sample_returned: boolean;
}
const PrintSample: React.FC<SampleProps> = ({
  samples,
  requestId,
  status,
  is_sample_returned,
}) => {
  const flattenedForms = useMemo(() => {
    // Recursive function to flatten forms and include children's form numbers and 'is_main' field
    const flattenForm = (
      form: RequestTypeForm,
    ): (Pick<
      RequestTypeForm,
      "id" | "form_number" | "response_json" | "is_main"
    > & { child_form_numbers: string[] })[] => {
      // Collect all children's form numbers
      const childFormNumbers =
        form.children?.map((child) => child.form_number) || [];

      // Create the current form object, including child_form_numbers and is_main
      const currentForm = {
        id: form.id,
        form_number: form.form_number,
        response_json: form.response_json,
        is_main: form.is_main, // Include the 'is_main' field
        child_form_numbers: childFormNumbers, // New property with children's form numbers
      };

      // Recursively flatten children
      const childrenForms = form.children?.flatMap(flattenForm) || [];

      // Return the current form along with all its flattened children
      return [currentForm, ...childrenForms];
    };

    // Flatten all the forms in the samples array
    return samples?.flatMap(flattenForm) || [];
  }, [samples]); // Recompute when 'samples' changes

  return (
    <div id="printSample" className="hidden">
      <h3 className="back-gray flex flex-row items-center justify-center py-[2px] text-center text-[12px] font-[600]">
        مشخصات نمونه‌ها
        {is_sample_returned && (
          <span id="print-is-returned-badge">
            {/* <Badge color="warning" className="bg-opacity-80"> */}
            عودت نمونه
            {/* </Badge> */}
          </span>
        )}
      </h3>
      <div className="grid grid-cols-3">
        {flattenedForms
          ?.filter((sample) => sample.is_main)
          ?.map((sample, index: number) => (
            <div
              key={index}
              className={`col-span-1 flex flex-col border-b border-l border-b-typography-secondary border-l-typography-secondary px-4 pb-2 pt-4 `}
            >
              {/* {index !== 0 && <hr></hr>} */}
              <p className="text-[12px] font-bold">
                <span>کد نمونه {index + 1}: </span>
                <span>{sample.form_number}</span>
              </p>
              {/* <p className="text-[10px]">
              <span>کد نمونه: </span>
              <span className="font-bold">{sample.form_number}</span>
            </p> */}
              <div id="print-sample-loader" className="flex-grow text-[10px]">
                <FBSimpleLoader jsonFB={sample.response_json} />
              </div>
              {/* <p className="mt-2 border-t border-t-background-paper-dark pt-2 text-[10px]">
                <span className="whitespace-nowrap">کد نمونه‌(های) کپی: </span>
                <span className="font-[700]">
                  {sample.child_form_numbers.length > 1 &&
                    `${
                      Number(sample.child_form_numbers[0].slice(-3)) +
                      Number(sample.child_form_numbers.length - 1)
                    } ${sample.child_form_numbers.length === 2 ? "و" : "تا"}  `}
                  {sample.child_form_numbers[0]}
                </span>
              </p> */}
              {/* {sample.child_form_numbers.join(", ")} */}
              <p className="mt-2 border-t border-t-background-paper-dark pt-2 text-[10px]">
                <span className="whitespace-nowrap">تعداد نمونه: </span>
                <span className="font-[700]">
                  {/* {sample.response_count !== 0 ? sample.response_count : 1} */}
                  {sample.child_form_numbers.length + 1}
                </span>
              </p>
              {(status === "در حال انجام" ||
                status === "در ‌انتظار نمونه" ||
                status === "تکمیل شده") && (
                <div id="barcode-wrapper">
                  <Barcode value={sample.form_number?.replace(/-/g, "")} />
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PrintSample;
