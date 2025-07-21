import * as yup from "yup";
import { useMemo } from "react";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import UserWalletCard from "./user-card";

const Wallet = () => {
  const walletValidationSchema = useMemo(() => {
    return yup.object({
      amount: validation.positiveIntegers,
    });
  }, []);
  return (
    <>
      <Card color={"white"} className="px-4 md:px-0">
        <div className="mb-8 flex flex-col-reverse justify-between gap-8 md:mb-12 md:flex-row">
          <Card
            variant="outline"
            className="w-full px-5 pb-6 pt-5 md:w-2/3 md:px-8 md:pb-0"
          >
            <h2 className="text-[20px] font-bold">شارژ کیف پول</h2>
            <p className="mb-8 pt-1 text-[14px]">
              در اینجا می‌توانید به سرعت و آسانی کیف پول خود را شارژ کنید.
            </p>
            <FormHandler
              validationSchema={walletValidationSchema}
              initialValues={{ amount: undefined }}
              handleSubmit={(values, utils) => {
                // console.log(values);
              }}
            >
              {(formik) => (
                <div className="flex flex-col items-start gap-5 md:flex-row">
                  <span className="w-full md:w-3/5">
                    <Input
                      name={"amount"}
                      formik={formik}
                      autoComplete={"amount"}
                      placeholder="مبلغ مورد نظر برای شارژ کیف پول را وارد کنید"
                      label="مبلغ شارژ (ریال)"
                      className="w-full"
                      type="Number"
                    />
                  </span>
                  <span className="w-full pb-1 md:mt-[32px] md:w-1/5">
                    <Button
                      type={"submit"}
                      variant="solid"
                      color="primary"
                      disabled={!formik.isValid}
                    >
                      شارژ حساب
                    </Button>
                  </span>
                </div>
              )}
            </FormHandler>
          </Card>
          <div className="w-full md:w-1/3">
            <UserWalletCard />
          </div>
        </div>
        {/* <TransactionList /> */}
      </Card>
    </>
  );
};

export default Wallet;
