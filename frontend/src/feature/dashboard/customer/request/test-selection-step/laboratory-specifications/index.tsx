import { Status } from "@kit/status";
import { Card } from "@kit/card";
import { LaboratorySpecificationType } from "./type";
import { useRouter } from "next/router";
import { useMemo } from "react";

export const LaboratorySpecifications = (
  props: LaboratorySpecificationType,
) => {
  const router = useRouter();

  const labId = useMemo(() => {
    return router.query.lab as string;
  }, [router.query.lab]);

  const { status, specifications, description } = props;

  return (
    <>
      <Card color="white" className="px-3 pb-4 pt-5 md:px-5">
        {/* header */}
        <div className="flex flex-row">
          {/* <Title headerTitle="مشخصات آزمایشگاه" /> */}
          <h3 className="grow px-2 text-[20px] font-[700]">مشخصات آزمایشگاه</h3>

          <Status color={`${status === "فعال" ? "success" : "error"}`}>
            {status}
          </Status>
        </div>
        {/* specifications */}
        <div className="flex flex-col gap-1 py-6 md:py-3 lg:flex-row">
          {Object.entries(specifications).map(([key, value], index) => (
            <Card
              key={index}
              color="paper"
              className="mx-2 flex flex-wrap items-center gap-2 px-4 py-3.5"
            >
              <h6 className="text-[16px] font-[500]">{key}:</h6>
              <span className="text-[14px]">{value}</span>
            </Card>
          ))}
        </div>
        {/* description */}
        <div className="px-2 py-2">
          <p className="text-[14px] leading-7 md:w-5/6">
            {description?.length ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            ) : (
              "---"
            )}
          </p>
        </div>
        {/* images */}
        {/*<div className="px-2 pb-4 md:px-11">*/}
        {/*  <h6 className="py-2 text-[16px] font-[700]">تصاویر آزمایشگاه</h6>*/}
        {/*  <div className="grid grid-cols-3 gap-3 md:grid-cols-6">*/}
        {/*    {laboratory?.data?.images &&*/}
        {/*      laboratory?.data?.images.map((image, index) => (*/}
        {/*        <Card key={index} color="paper" className="h-[80px] w-full">*/}
        {/*          <Image*/}
        {/*            src={image}*/}
        {/*            alt="دانشگاه شریف"*/}
        {/*            width={500}*/}
        {/*            height={500}*/}
        {/*            className="h-full w-full object-fill"*/}
        {/*          />*/}
        {/*        </Card>*/}
        {/*      ))}*/}
        {/*  </div>*/}
        {/*</div>*/}
      </Card>
    </>
  );
};
