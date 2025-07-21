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
import { GrantRecordType } from "@api/service/grant-record/type";

const CreateGroupGrant = () => {
  const clientQuery = useQueryClient();
  // handle modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // grant create group file api
  const { mutateAsync } = useMutation(
    apiGrantRecord(true, {
      success: "ثبت گرنت گروهی موفقیت آمیز بود",
      fail: "افزودن فایل گرنت گروهی انجام نشد",
      waiting: "در حال انتظار",
    }).createGroupList(),
  );
  // convert file to Base64 string
  const toBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const submit = (values: { file: string }) => {
    const data = {
      file: values.file,
    };
    mutateAsync(data)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiGrantRecord().url],
        });

        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card
      color={"white"}
      className="2xl:w-[30vw] flex max-h-[95vh] w-[95vw] flex-col p-8 sm:w-[50vw] xl:w-[40vw]"
    >
      <div className="mb-9 flex flex-row items-center justify-between">
        <h6 className="text-[18px] font-bold">افزودن گرنت گروهی</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <FormHandler
        className="pt-4"
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
              placeholder="فایل لیست گرنت گروهی را آپلود کنید"
              label={"فایل اکسل گرنت گروهی"}
              type="file"
              accept=".xls,.xlsx"
            />
            <div className="mt-7 flex flex-col items-center justify-between md:flex-row">
              <span className="flex cursor-pointer flex-row gap-1 text-[13px] font-medium text-info">
                <a
                  href="https://slims.2tica.ir/static/fixtures/grantsen.xlsx"
                  download
                >
                  دریافت فایل نمونه اکسل قابل قبول
                </a>
                <SvgIcon
                  fillColor="info"
                  className={"[&_svg]:h-[15px] [&_svg]:w-[15px]"}
                >
                  <IcDownload />
                </SvgIcon>
              </span>
              <span className="mt-6 flex gap-3 md:mt-auto">
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
export default CreateGroupGrant;
