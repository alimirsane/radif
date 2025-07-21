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
import { useMemo } from "react";

const ExperimentDuration = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);
  const unitsList = useMemo(() => {
    return [
      { value: "sample", name: "نمونه" },
      { value: "time", name: "دقیقه" },
      { value: "hour", name: "ساعت" },
    ];
  }, []);
  // get request id
  const modalData = useModalHandler((state) => state.modalData);
  const validationSchema = yup.object({
    duration: yup
      .number()
      .required("این فیلد اجباریست")
      // .positive("تخفیف باید عددی مثبت باشد")
      .min(0, "تخفیف باید عددی مثبت باشد")
      .integer("باید یک عدد صحیح باشد"),
    // .max(100, "تخفیف می‌تواند حداکثر 100 باشد"),
  });

  const { mutateAsync } = useMutation(
    apiRequest(true, {
      success: "ثبت زمان آزمون موفقیت آمیز بود",
      fail: "ثبت زمان آزمون انجام نشد",
      waiting: "در حال انجام",
    }).updateTestDuration(modalData.requestId),
  );
  const queryClient = useQueryClient();
  const submitDiscount = (values: { duration: number | undefined }) => {
    const data = {
      test_duration: Number(values.duration),
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
        <h2 className="text-[20px] font-[700]">تعیین زمان انجام آزمون</h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <FormHandler
        initialValues={{ duration: undefined }}
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
                name="duration"
                autoComplete="duration"
                placeholder={"مدت زمان انجام آزمون را وارد نمایید"}
                label={`زمان انجام آزمون (${
                  unitsList.find(
                    (unit) =>
                      unit.value === modalData.testUnitType ||
                      unit.name === modalData.testUnitType,
                  )?.name
                })`}
                type="number"
                className="pl-[30px]"
              />
              <span className="absolute left-3 top-[37%] translate-y-1 text-[14px] text-typography-gray">
                {
                  unitsList.find(
                    (unit) =>
                      unit.value === modalData.testUnitType ||
                      unit.name === modalData.testUnitType,
                  )?.name
                }
              </span>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <Button variant="outline" onClick={() => hideModal()}>
                لغو
              </Button>
              <Button type="submit" disabled={!formik.isValid}>
                ثبت زمان آزمون
              </Button>
            </div>
          </>
        )}
      </FormHandler>
    </Card>
  );
};

export default ExperimentDuration;
