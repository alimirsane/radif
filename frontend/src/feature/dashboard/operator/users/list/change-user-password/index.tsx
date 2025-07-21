import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import * as yup from "yup";
import { IcCheck } from "@feature/kits/common/icons";
import { SvgIcon } from "@kit/svg-icon";
import { useUserEditHandler, useReloadUsers } from "../get-info-user";
import { apiUser } from "@api/service/user";
import { useModalHandler } from "@utils/modal-handler/config";
import { CurrentUserType } from "@api/service/user/type/current-user";
import React from "react";
import { useRouter } from "next/router";

const ChangeUserPassword = () => {
  const { id, password } = useUserEditHandler();
  const hideModal = useModalHandler((state) => state.hideModal);
  const { setReloadUsers } = useReloadUsers();
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: "ثبت رمز عبور موفقیت آمیز بود",
      fail: "ثبت رمز عبور انجام نشد",
      waiting: "در حال انتظار",
    }).updatePassword(id),
  );
  const user: CurrentUserType = useModalHandler((state) => state.modalData);
  const initialValues = useMemo(() => {
    return {
      password: user.password,
    };
  }, [user]);

  const userAddValidation = useMemo(() => {
    return yup.object({
      password: validation.password,
    });
  }, []);

  const submit = (values: any) => {
    let data = {
      password: values.password,
    };
    mutateAsync(data)
      .then((res) => {
        setReloadUsers(true);
        setTimeout(() => {
          hideModal();
        }, 1000);
      })
      .catch((err) => {});
  };

  const router = useRouter();

  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const labelCustomerUser = useMemo(() => {
    return isCustomer ? "مشتری" : "همکار";
  }, [isCustomer]);

  return (
    <FormHandler
      validationSchema={userAddValidation}
      initialValues={initialValues}
      handleSubmit={(values) => submit(values)}
    >
      {(formik) => (
        <div className="md:px-6">
          <div className="grid grid-cols-1 gap-[24px]">
            <Input
              label="رمز عبور (حداقل 5 کاراکتر)"
              placeholder={`رمز عبور جدید ${labelCustomerUser} را وارد کنید`}
              name={"password"}
              formik={formik}
              defaultValue={password}
              className="bg-common-white"
              type="password"
              passwordHandler
            />
          </div>
          <Button
            className="mr-auto mt-[32px]"
            startIcon={
              <SvgIcon
                strokeColor="white"
                className={"[&>svg]:h-[15px] [&>svg]:w-[15px]"}
              >
                <IcCheck />
              </SvgIcon>
            }
            variant="solid"
            color="primary"
            disabled={!formik.isValid}
          >
            ثبت رمز عبور
          </Button>
        </div>
      )}
    </FormHandler>
  );
};

export default ChangeUserPassword;
