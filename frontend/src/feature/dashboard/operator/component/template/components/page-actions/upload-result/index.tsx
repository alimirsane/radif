import { FormHandler } from "@utils/form-handler";
import { Card } from "@kit/card";
import { TextArea } from "@kit/text-area";
import { Button } from "@kit/button";
import { useModalHandler } from "@utils/modal-handler/config";
import { useCallback, useMemo, useState } from "react";
import { validation } from "@utils/form-handler/validation";
import * as yup from "yup";
import { Input } from "@kit/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiResult } from "@api/service/results";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { useRouter } from "next/router";
import { apiRequest } from "@api/service/request";

interface FormType {
  file: string;
  description: string;
  temperature: string;
  pressure: string;
  humidity: string;
  uncertainty: string;
}

const UploadResult = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);
  const modalData = useModalHandler((state) => state.modalData);
  const clientQuery = useQueryClient();
  const [hasNoFile, setHasNoFile] = useState<boolean>(
    modalData.request.result_objs[0]?.file?.includes("noDataDefaultfile"),
  );
  const { mutateAsync: create } = useMutation(
    apiResult(true, {
      success: "آپلود نتایج موفقیت آمیز بود",
      fail: "آپلود نتایج انجام نشد",
      waiting: "در حال انجام",
    }).create(),
  );
  const { mutateAsync: update } = useMutation(
    apiResult(true, {
      success: "ویرایش نتایج موفقیت آمیز بود",
      fail: "ویرایش نتایج انجام نشد",
      waiting: "در حال انجام",
    }).update(modalData?.request?.result_objs[0]?.id),
  );
  const initialValues = useMemo(() => {
    return {
      description: hasNoFile
        ? !!modalData.request.result_objs.length
          ? modalData?.request?.result_objs[0]?.description
          : "این آزمون فاقد فایل نتیجه می‌باشد."
        : !!modalData.request.result_objs.length
          ? modalData?.request?.result_objs[0]?.description
          : "نتایج پیوست است.",
      file: "",
      temperature: !modalData.request.result_objs.length
        ? "20"
        : modalData?.certificateObj?.temperature,
      pressure: !modalData.request.result_objs.length
        ? "1"
        : modalData?.certificateObj?.pressure,
      humidity: !modalData.request.result_objs.length
        ? "25"
        : modalData?.certificateObj?.humidity,
      uncertainty: !modalData.request.result_objs.length
        ? ""
        : modalData?.certificateObj?.uncertainty,
    };
  }, [modalData, hasNoFile]);

  // file valid formats
  const validFileExtensions = useMemo(() => {
    return ["pdf", "jpg", "png", "zip"];
  }, []);
  // file size limit: 500 MB in bytes
  const MAX_FILE_SIZE = useMemo(() => {
    return 500 * 1024 * 1024;
  }, []);
  // file error handler
  const [fileError, setFileError] = useState<boolean>(false);
  const [fileErrorMsg, setFileErrorMsg] = useState<string>("");
  // file validation
  const checkFileValidation = useCallback(
    (file: File | null) => {
      if (!file) return;
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (validFileExtensions.includes(extension || "")) {
        if (file.size > MAX_FILE_SIZE) {
          //  Check file size
          setFileErrorMsg("حجم فایل بیش از حد مجاز (500 مگابایت) می‌باشد");
          setFileError(true);
        } else {
          setFileError(false);
        }
      } else {
        setFileErrorMsg("فرمت فایل بارگذاری شده قابل قبول نمی‌باشد");
        setFileError(true);
      }
    },
    [MAX_FILE_SIZE, validFileExtensions],
  );

  const validationSchema = useMemo(() => {
    return yup.object({
      description: validation.requiredInput,
      file: validation.requiredInput,
    });
  }, []);
  const editValidationSchema = useMemo(() => {
    return yup.object({
      description: validation.requiredInput,
    });
  }, []);
  // default file for experiments with no result file
  const createDefaultFile = () => {
    const content = "\uFEFFاین آزمون فاقد فایل نتیجه می‌باشد.";
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const file = new File([blob], "noDataDefaultfile.txt", {
      type: "text/plain;charset=utf-8",
    });
    return file;
  };

  const submit = (values: FormType) => {
    const data = {
      file: values.file || createDefaultFile(),
      description: values.description,
      request: modalData.request.id.toString(),
    };
    create(data)
      .then((res) => {
        updateCertificate(values);
      })
      .catch((err) => {});
  };

  const downloadFile = (fileUrl: string | undefined) => {
    const link = document.createElement("a");
    link.href = fileUrl ? fileUrl : "";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  async function urlToFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();
    const mimeType =
      response.headers.get("Content-Type") || "application/octet-stream";

    return new File([blob], filename, {
      type: mimeType,
      lastModified: Date.now(),
    });
  }

  const editResult = async (values: FormType) => {
    let fileToSend;
    if (values.file) {
      // user uploaded a new file
      fileToSend = values.file;
    } else {
      if (!hasNoFile) {
        // no new file uploaded and use the previous file
        fileToSend = await urlToFile(
          modalData.request.result_objs[0].file,
          modalData.request.result_objs[0].file.split("/").pop() || "file_name",
        );
      } else {
        // no file provided, use default file
        fileToSend = createDefaultFile();
      }
    }
    // else {
    //   // no new file uploaded and use the previous file
    //   fileToSend = await urlToFile(
    //     modalData.request.result_objs[0].file,
    //     modalData.request.result_objs[0].file.split("/").pop() || "file_name",
    //   );
    // }

    const data = {
      file: fileToSend,
      description: values.description,
      request: modalData.request.id.toString(),
    };
    update(data)
      .then((res) => {
        updateCertificate(values);
      })
      .catch((err) => {});
  };

  // certificate edit api
  const { mutateAsync: editCertificate } = useMutation(
    apiRequest(false).updateCertificate(modalData?.request.id ?? -1),
  );
  // update certificate -> certificate_obj
  const updateCertificate = (values: FormType) => {
    const data = {
      temperature: values.temperature,
      humidity: values.humidity,
      pressure: values.pressure,
      uncertainty: values.uncertainty,
    };
    editCertificate(data)
      .then((res) => {
        // refetch data
        router.query.certificate = "updated";
        router.push(router);

        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });

        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[30vw] w-[80vw] p-6 sm:w-[55vw] xl:w-[40vw]"
    >
      <span className="mb-6 flex flex-row items-center justify-between">
        <h2 className="text-[20px] font-[700]">
          {!!modalData.request.result_objs.length &&
          modalData.action_slug === "upload_result"
            ? "ویرایش نتایج"
            : "بارگذاری نتایج"}
        </h2>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      {!!modalData.request.result_objs.length && (
        <div
          className={
            modalData.action_slug === "upload_result"
              ? "mb-2 border-b border-primary-light pb-6"
              : "pb-4"
          }
        >
          <h2 className="mb-2 text-[16px] font-[700]">
            {modalData.action_slug === "upload_result" ? "فایل نتایج قبلی" : ""}
          </h2>
          <div className="rounded-lg bg-background-paper p-4">
            {modalData.request.result_objs[0]?.file?.includes(
              "noDataDefaultfile",
            ) && (
              <p className="text-[14px]">
                {/* <span className="ml-1 font-bold">توضیحات:</span>
                {modalData.request.result_objs[0].description} */}
                این آزمون فاقد فایل نتیجه می‌باشد.
              </p>
            )}

            {!modalData.request.result_objs[0]?.file?.includes(
              "noDataDefaultfile",
            ) && (
              <Button
                className={"mx-auto my-2"}
                onClick={() =>
                  downloadFile(
                    modalData.request.result_objs !== undefined
                      ? modalData.request.result_objs[0].file
                      : "",
                  )
                }
              >
                دریافت فایل نتایج
              </Button>
            )}
          </div>
        </div>
      )}
      {modalData.action_slug === "upload_result" && (
        <FormHandler
          className="pt-2"
          initialValues={initialValues}
          validationSchema={
            modalData.action_slug === "upload_result"
              ? editValidationSchema
              : validationSchema
          }
          handleSubmit={(values, utils) => {
            if (!fileError) {
              !!modalData.request.result_objs.length
                ? editResult(values)
                : submit(values);
            }
          }}
        >
          {(formik) => (
            <div className="flex flex-col gap-5">
              <div>
                <input
                  type="checkbox"
                  onChange={() => {
                    setHasNoFile(!hasNoFile);
                  }}
                  checked={hasNoFile}
                  name="hasNoFile"
                  className={`accent-black h-3 w-3`}
                ></input>
                <label
                  htmlFor="hasNoFile"
                  className={`pr-2 text-[14px] font-medium`}
                >
                  این آزمون فاقد فایل نتیجه می‌باشد.
                </label>
              </div>
              <div>
                <Input
                  name={"file"}
                  formik={formik}
                  placeholder="فایل نتایج را آپلود کنید"
                  label={"فایل نتایج"}
                  type="file"
                  accept=".xls,.xlsx,.pdf,.jpg,.png,.zip"
                  // accept=".xls,.xlsx,.pdf,.jpg,.png,.docx,.doc,.rar,.zip"
                />
                {fileError && (
                  <p className="mt-1 text-[12px] text-error">{fileErrorMsg}</p>
                )}
                <p className="mt-1 text-[12px] text-typography-secondary">
                  * فرمت‌های قابل قبول شامل .xls, .xlsx, pdf, .jpg, .png, .zip.
                  و حداکثر حجم مجاز 500 مگابایت می‌باشد.
                </p>
              </div>
              <div className=" grid gap-5 md:grid-cols-2">
                <div className={`relative items-center`}>
                  <Input
                    name={"temperature"}
                    formik={formik}
                    autoComplete={"temperature"}
                    placeholder="دمای انجام آزمون را وارد کنید"
                    label={"دما"}
                    type="number"
                    className="pl-[30px]"
                  />
                  <span className="absolute left-3 top-[48%] translate-y-1 text-[14px] text-typography-gray">
                    C&deg;
                  </span>
                </div>
                <div className={`relative items-center`}>
                  <Input
                    name={"humidity"}
                    formik={formik}
                    autoComplete={"humidity"}
                    placeholder="رطوبت انجام آزمون را وارد کنید"
                    label={"رطوبت"}
                    type="number"
                    className="pl-[30px]"
                  />
                  <span className="absolute left-3 top-[48%] translate-y-1 text-[14px] text-typography-gray">
                    RH %
                  </span>
                </div>
                <div className={`relative items-center`}>
                  <Input
                    name={"pressure"}
                    formik={formik}
                    autoComplete={"pressure"}
                    placeholder="فشار انجام آزمون را وارد کنید"
                    label={"فشار"}
                    type="number"
                    className="pl-[30px]"
                  />
                  <span className="absolute left-3 top-[48%] translate-y-1 text-[14px] text-typography-gray">
                    atm
                  </span>
                </div>
                <div>
                  <Input
                    name={"uncertainty"}
                    formik={formik}
                    autoComplete={"uncertainty"}
                    placeholder="عدم قطعیت را وارد کنید"
                    label={"عدم قطعیت"}
                    type="number"
                  />
                </div>
              </div>
              <TextArea
                formik={formik}
                rows={6}
                name="description"
                label={"توضیحات"}
              />
              <div className="mt-2 flex justify-end gap-3">
                <Button variant="outline" onClick={() => hideModal()}>
                  لغو
                </Button>
                <Button
                  disabled={
                    !!modalData.request.result_objs.length
                      ? !formik.isValid || fileError
                      : !formik.isValid ||
                        (!hasNoFile && !formik.values.file) ||
                        (hasNoFile && !formik.values.description) ||
                        fileError
                    // : !formik.isValid || !formik.values.file || fileError
                  }
                  type="submit"
                >
                  آپلود نتایج
                </Button>
              </div>
            </div>
          )}
        </FormHandler>
      )}
    </Card>
  );
};

export default UploadResult;
