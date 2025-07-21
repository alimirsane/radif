import { useRouter } from "next/router";

import Header from "@feature/dashboard/common/header";
import { Card } from "@kit/card";
import { TestCard } from "./test-card";
import { FinalCostCard } from "../common/cost-card";
import { ExperimentsType } from "@api/service/laboratory/type";

export const LaboratoryTestsList: React.FC<{
  experiments: ExperimentsType[] | undefined;
  laboratoryStatus: string;
}> = ({ experiments, laboratoryStatus }) => {
  const router = useRouter();

  return (
    <>
      <div className="pt-5 md:pt-12">
        <Header
          title="فهرست آزمون‌های آزمایشگاه"
          description="آزمون‌هایی که در این آزمایشگاه ارائه می‌شود به شرح زیر می‌باشد:"
        />
        <div
          // color="white"
          // className="mt-5 border border-background-paper-dark px-3 md:px-6"
          className="mt-5"
        >
          {!experiments?.length && (
            <p className="py-5 text-[14px]">آزمونی یافت نشد.</p>
          )}
          {!!experiments?.length &&
            experiments.map((test, index) => (
              <div key={index} className="my-5">
                <TestCard
                  experiment={test}
                  laboratoryStatus={laboratoryStatus}
                />
              </div>
            ))}
          {/*<FinalCostCard*/}
          {/*  paramsCount={*/}
          {/*    Number(router.query.selectedCount)*/}
          {/*      ? Number(router.query.selectedCount)*/}
          {/*      : 0*/}
          {/*  }*/}
          {/*  price={*/}
          {/*    Number(router.query.totalCost)*/}
          {/*      ? Number(router.query.totalCost)*/}
          {/*      : 0*/}
          {/*  }*/}
          {/*>*/}
          {/*  <></>*/}
          {/*</FinalCostCard>*/}
        </div>
      </div>
    </>
  );
};
