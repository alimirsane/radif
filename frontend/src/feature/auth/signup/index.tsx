import { useRouter } from "next/router";
import { useMemo } from "react";

import { Button } from "@kit/button";
import { NaturalType } from "./form/natural-type";
import { LegalType } from "./form/legal-type";
import Link from "next/link";
import { routes } from "@data/routes";

export const SignUpForm = () => {
  const router = useRouter();
  const type = useMemo(() => {
    return router.query.type ?? "natural-person";
  }, [router]);

  return (
    <>
      <div className="flex flex-row items-center justify-center pt-5">
        <p className="text-[14px]">در صورتی که حساب کاربری دارید،</p>
        <Link
          href={routes.signIn()}
          color="secondary"
          className="rounded-md px-2 py-1 text-[14px] font-medium text-info transition-all duration-500 hover:bg-info-light/10"
        >
          وارد شوید
        </Link>
      </div>
      {/* person type : legal | natural */}
      <div className="flex flex-row justify-center py-6">
        <div className="flex w-full justify-around rounded-[8px] bg-background-paper px-5 py-2.5 lg:w-auto lg:basis-1/2">
          <Button
            variant={
              (router.query.type ?? "natural-person") === "natural-person"
                ? "solid"
                : "text"
            }
            color="secondary-light"
            className="text-typography-main"
            onClick={() => {
              router.query.type = "natural-person";
              router.push(router);
            }}
          >
            مشتری حقیقی
          </Button>
          <Button
            variant={type === "legal-person" ? "solid" : "text"}
            color="secondary-light"
            className="text-typography-main"
            onClick={() => {
              router.query.type = "legal-person";
              router.push(router);
            }}
          >
            مشتری حقوقی
          </Button>
        </div>
      </div>
      {type === "natural-person" && <NaturalType />}
      {type === "legal-person" && <LegalType />}
    </>
  );
};
