import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { FBLoader } from "@module/form-builder/loader";
import { FormType } from "@api/service/form/type";
import { ServiceBaseModel } from "@api/config/model/service-base-model";

const DisplayForm = ({
  form,
}: {
  form: ServiceBaseModel<FormType> | undefined;
}) => {
  const router = useRouter();
  const userForm = Array.isArray(form?.data?.json_init)
    ? form?.data?.json_init
    : [];
  return (
    <>
      <div className="pt-1">
        <div className="felx-row mx-4 flex items-center justify-between border-b border-b-background-paper-dark pb-8">
          <h6 className="text-[18px] font-bold">{form?.data.title}</h6>
          <Button
            variant="solid"
            color="primary"
            onClick={() => {
              router.query.form = "edit";
              router.push(router);
            }}
          >
            ویرایش فرم
          </Button>
        </div>
        <div className="px-4 pt-6">
          <FBLoader jsonFB={userForm} submitFB={() => {}} />
        </div>
      </div>
    </>
  );
};

export default DisplayForm;
