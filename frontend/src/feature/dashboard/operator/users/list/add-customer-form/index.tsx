import React from "react";
import { useMemo } from "react";
import { useRouter } from "next/router";

import { Button } from "@kit/button";
import { PersonalCustomer } from "./personal";
import { useReloadUsers } from "../get-info-user";
import { useModalHandler } from "@utils/modal-handler/config";
import { BusinessCustomer } from "../add-customer-form/business";

const AddCustomerForm = () => {
  const router = useRouter();
  const type = useMemo(() => {
    return router.query.type ?? "personal";
  }, [router]);
  const { setReloadUsers } = useReloadUsers();
  const hideModal = useModalHandler((state) => state.hideModal);

  const resetAndClose = () => {
    setReloadUsers(true);
    setTimeout(() => {
      hideModal();
    }, 1000);
  };
  return (
    <>
      {/* user type : personal | business */}
      <div className="flex flex-row justify-center pb-4">
        <div className="flex w-full justify-around rounded-[8px] bg-background-paper px-5 py-2">
          <Button
            variant={
              (router.query.type ?? "personal") === "personal"
                ? "solid"
                : "text"
            }
            color="secondary-light"
            className="text-typography-main"
            onClick={() => {
              router.query.type = "personal";
              router.push(router);
            }}
          >
            مشتری حقیقی
          </Button>
          <Button
            variant={type === "business" ? "solid" : "text"}
            color="secondary-light"
            className="text-typography-main"
            onClick={() => {
              router.query.type = "business";
              router.push(router);
            }}
          >
            مشتری حقوقی
          </Button>
        </div>
      </div>
      {type === "personal" && <PersonalCustomer closeModal={resetAndClose} />}
      {type === "business" && <BusinessCustomer closeModal={resetAndClose} />}
    </>
  );
};

export default AddCustomerForm;
