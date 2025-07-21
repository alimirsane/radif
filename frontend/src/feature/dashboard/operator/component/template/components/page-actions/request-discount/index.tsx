import { FormHandler } from "@utils/form-handler";
import { Card } from "@kit/card";
import { TextArea } from "@kit/text-area";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { validation } from "@utils/form-handler/validation";
import { Input } from "@kit/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useRouter } from "next/router";
import { apiRequest } from "@api/service/request";
import * as yup from "yup";

const RequestDiscount = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);

  // get request id
  const requestId = useModalHandler((state) => state.modalData);
  const validationSchema = yup.object({
    percent: yup
      .number()
      .required("این فیلد اجباریست")
      // .positive("تخفیف باید عددی مثبت باشد")
      .min(0, "تخفیف باید عددی بین ۰ تا ۱۰۰ باشد")
      .integer("باید یک عدد صحیح باشد")
      .max(100, "تخفیف می‌تواند حداکثر 100 باشد"),
    description: validation.requiredInput,
  });

  const { mutateAsync } = useMutation(
    apiRequest(true, {
      success: "اعمال تخفیف موفقیت آمیز بود",
      fail: "اعمال تخفیف انجام نشد",
      waiting: "در حال انجام",
    }).submitDiscount(requestId),
  );
  const queryClient = useQueryClient();
  const submitDiscount = (values: {
    percent: number | undefined;
    description: string;
  }) => {
    const data = {
      description: values.description,
      action: "request_discount",
      value: values.percent?.toString(),
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        queryClient.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[20vw] w-[80vw] px-8 pb-7 pt-6 sm:w-[50vw] xl:w-[30vw]"
    >
      <span className="mb-9 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">اعمال تخفیف</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FormHandler
        initialValues={{ percent: undefined, description: "" }}
        validationSchema={validationSchema}
        handleSubmit={(values, utils) => {
          submitDiscount(values);
        }}
      >
        {(formik) => (
          <>
            <div className="relative pb-5">
              <Input
                formik={formik}
                name="percent"
                autoComplete="percent"
                placeholder={"تخفیف مورد نظر خود را وارد نمایید"}
                label="میزان تخفیف"
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-3 top-[37%] translate-y-1 text-[14px] text-typography-gray">
                درصد
              </span>
            </div>
            <div>
              <TextArea
                formik={formik}
                name="description"
                label="توضیحات"
                placeholder="توضیحات تخفیف را وارد نمایید"
              />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => hideModal()}>
                لغو
              </Button>
              <Button type="submit" disabled={!formik.isValid}>
                ثبت تخفیف
              </Button>
            </div>
          </>
        )}
      </FormHandler>
    </Card>
  );
};

export default RequestDiscount;
