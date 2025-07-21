import * as yup from "yup";

import { IcClose, IcDownload } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { Fab } from "@kit/fab";
import { Input } from "@kit/input";
import { SvgIcon } from "@kit/svg-icon";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useModalHandler } from "@utils/modal-handler/config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGrantRecord } from "@api/service/grant-record";
import { apiPaymentRecord } from "@api/service/payment-record";
import { useState } from "react";

const TransactionsContradiction = () => {
  const clientQuery = useQueryClient();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // handle download file
  const [displayFile, setDisplayFile] = useState<boolean>(false);
  const [fileUrl, setFileUrl] = useState<string>("");
  // convert file to Base64 string
  const toBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  // create transaction file api
  const { mutateAsync: createTransactionFile } = useMutation(
    apiPaymentRecord(true, {
      success:
        "ثبت فایل تراکنش‌ها موفقیت آمیز بود. می‌توانید اکسل مغایرت را دانلود کنید.",
      fail: "ثبت فایل تراکنش‌ها انجام نشد.",
      waiting: "در حال انتظار",
    }).createTransactionsContradiction(),
  );
  const submit = (values: { file: string }) => {
    const data = {
      file: values.file,
    };
    createTransactionFile(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });
        setDisplayFile(true);
        setFileUrl(res?.data.download_url ?? "");
        // hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[30vw] flex w-[80vw] flex-col p-8 sm:w-[50vw] xl:w-[40vw]"
    >
      <div className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[18px] font-bold">مغایرت گیری</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <FormHandler
        className="pt-2"
        initialValues={{ file: "" }}
        validationSchema={yup.object({
          file: validation.requiredInput,
        })}
        handleSubmit={(values, utils) => {
          submit(values);
        }}
      >
        {(formik) => (
          <>
            <Input
              name={"file"}
              formik={formik}
              placeholder="فایل موردنظر را آپلود کنید"
              label={"فایل تراکنش‌ها"}
              type="file"
              accept=".xls,.xlsx"
            />
            <div
              className={`${displayFile ? "justify-between" : "justify-end"} mt-7 flex flex-row items-center`}
            >
              {displayFile && (
                <span className="flex cursor-pointer flex-row gap-1 text-[13px] font-medium text-info">
                  <a
                    // href="https://slims.2tica.ir/static/fixtures/grantsen.xlsx"
                    href={fileUrl}
                    download
                  >
                    دانلود اکسل مغایرت
                  </a>
                  <SvgIcon
                    fillColor="info"
                    className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                  >
                    <IcDownload />
                  </SvgIcon>
                </span>
              )}
              <span className="flex gap-3">
                <Button variant="outline" onClick={() => hideModal()}>
                  لغو
                </Button>
                <Button type="submit">آپلود فایل</Button>
              </span>
            </div>
          </>
        )}
      </FormHandler>
    </Card>
  );
};
export default TransactionsContradiction;
