import React from "react";
import { useRouter } from "next/router";
import { LaboratoryType } from "@api/service/laboratory/type";
import { Button } from "@kit/button";
import { Card } from "@kit/card";
import Image from "next/image";
import { Status } from "@kit/status";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

interface LaboratoryPropsType {
  laboratory: LaboratoryType;
}

const ListItem: React.FC<LaboratoryPropsType> = ({
  laboratory,
}: LaboratoryPropsType) => {
  const { name, id, description, image, status } = laboratory;
  const router = useRouter();
  const openModal = useModalHandler((state) => state.openModal);

  return (
    <Card
      color="white"
      className="flex w-full cursor-pointer flex-col rounded-[16px] border border-background-paper-dark p-[16px] text-typography-main"
      onClick={() => {
        openModal(ModalKeys.REQUEST_FLOW_DESCRIPTION, {
          labId: id?.toString(),
        });
        // router.query.lab = id?.toString();
        // router.push(router);
      }}
    >
      {/* <div className="h-[200px] w-full overflow-hidden rounded-[16px] bg-common-gray/25">
       <Image
           src={image ?? ""}
           width={500}
           height={500}
           alt={name ?? ""}
           className="h-full w-full object-fill"
         />
       </div> */}

      <div
        className="relative w-full"
        style={{ paddingBottom: "66.67%" /* 3:2 aspect ratio */ }}
      >
        <Image
          src={image ?? ""}
          alt={name ?? "عکس آزمایشگاه"}
          layout="fill" // Make image fill the parent container
          objectFit="cover" // Ensure the image maintains aspect ratio and covers the container
          className="absolute inset-0 rounded-[16px]" // Ensure the image takes full width/height of the parent
        />
      </div>
      <div className="flex flex-col justify-between pb-[4px] pt-[16px] md:flex-row">
        <h5 className="text-[18px] font-bold">{name}</h5>

        {status === "inactive" && (
          <span className="self-end">
            <Status color={`error`}>غیرفعال</Status>
          </span>
        )}
      </div>
      <p className="text-[14px]">
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

      <div className="mt-auto">
        <Button
          className="mx-auto mt-[16px] w-full md:w-fit"
          onClick={() => {
            // router.query.lab = id?.toString();
            // router.push(router);
            openModal(ModalKeys.REQUEST_FLOW_DESCRIPTION, {
              labId: id?.toString(),
            });
          }}
        >
          مشاهده آزمایشگاه
        </Button>
      </div>
    </Card>
  );
};

export default ListItem;
