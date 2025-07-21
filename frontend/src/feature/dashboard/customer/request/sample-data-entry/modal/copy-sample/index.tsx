import { FormHandler } from "@utils/form-handler";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { Input } from "@kit/input";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useRouter } from "next/router";
import * as yup from "yup";
import { useCopySampleHandler } from "@hook/copy-sample-handler";
import { apiFormResponse } from "@api/service/form-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { apiRequest } from "@api/service/request";

const CopySample = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);

  // get sample sample_id from modal
  const sample = useModalHandler((state) => state.modalData);
  // get current samples and setSampleCount
  const { samples, setSampleCount } = useCopySampleHandler();

  // find current sample count, if it exists
  const currentSample = samples.find((s) => s.sample_id === sample.id);
  // get current request id
  const { requestId, setRequestId } = useCurrentRequestHandler();
  const initialCount = currentSample?.count || undefined;
  const validationSchema = yup.object({
    count: yup
      .number()
      .required("این فیلد اجباریست")
      .positive("تعداد باید عددی مثبت باشد")
      .integer("باید یک عدد صحیح باشد"),
    // .max(99, "تعداد باید کمتر از 100 باشد"),
  });

  const submitCopy = (values: { count: number | undefined }) => {
    if (values.count && sample.id) {
      // Use the setSampleCount function to add or update the sample in the Zustand store
      setSampleCount(sample.id, values.count);
      hideModal();
    }
  };
  const queryClient = useQueryClient();
  // update sample api
  const { mutateAsync: updateFormOfSample } = useMutation(
    apiFormResponse(true, {
      success: "ثبت کپی نمونه موفقیت آمیز بود",
      fail: "ثبت کپی نمونه انجام نشد",
      waiting: "در حال انتظار",
    }).update(sample.id),
  );
  // update sample
  const updateSample = (values: { count: number | undefined }) => {
    // const responseJson = json.map((item) => {
    //   const value = values[item.name ?? ""];
    //   if (value !== undefined) {
    //     return { ...item, value };
    //   }
    //   return item;
    // });
    if (values.count && sample.id) {
      const data = {
        request: requestId,
        response_count: values.count,
        response_json: sample.response_json,
      };
      updateFormOfSample(data)
        .then((res) => {
          // Use the setSampleCount function to add or update the sample in the Zustand store
          setSampleCount(sample.id, values.count ?? 0);
          queryClient.invalidateQueries({
            queryKey: [apiFormResponse().url],
          });
          queryClient.invalidateQueries({
            queryKey: [apiRequest().url],
          });
          hideModal();
        })
        .catch((err) => {});
    }
  };
  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] w-[80vw] px-8 pb-7 pt-6 sm:w-[50vw] xl:w-[30vw]"
    >
      <span className="mb-8 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">تعداد نمونه</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FormHandler
        initialValues={{ count: initialCount }}
        validationSchema={validationSchema}
        handleSubmit={(values, utils) => {
          // submitCopy(values);
          updateSample(values);
        }}
      >
        {(formik) => (
          <>
            <div>
              <Input
                formik={formik}
                name="count"
                autoComplete="count"
                placeholder={"تعداد نمونه مورد نظر خود را وارد نمایید"}
                label="تعداد نمونه"
                type="number"
              />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => hideModal()}>
                لغو
              </Button>
              <Button type="submit" disabled={!formik.isValid}>
                ثبت تعداد نمونه
              </Button>
            </div>
          </>
        )}
      </FormHandler>
    </Card>
  );
};

export default CopySample;
