import { Button } from "@kit/button";
import { useRouter } from "next/router";
import Image from "next/image";
import { RequestTypeForm } from "@api/service/request/type";

const DescriptionForm = (props: { sampleData: RequestTypeForm }) => {
  const router = useRouter();
  // const { maintenance, material, name, structure, type, url, barcode } = props;
  const { sampleData } = props;

  return (
    <>
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        توضیحات فرم درخواست : نمونه 1
      </h3>
      <div className="flex w-full flex-col gap-[14px] rounded-[24px] bg-background-paper-light px-[24px]  py-[16px]">
        <div className="flex justify-end gap-[16px] pb-[16px]">
          <Button
            size="small"
            variant="outline"
            onClick={() =>{}
            }
          >
            تایید نمونه
          </Button>
          <Button
            size="small"
            variant="outline"
            onClick={() =>{}
            }
          >
            رد نمونه
          </Button>
        </div>
        <div className="flex gap-[16px]">
          <div className="w-8/12">
            <p className="flex gap-[14px] pb-[16px] text-typography-main">
              <span className="text-[18px] font-bold">نام نمونه : </span>
              <span className="text-[16px]">نمونه {sampleData?.id}</span>
            </p>
            {/* <p className="flex gap-[14px] pb-[16px] text-typography-main">
              <span className="text-[18px] font-bold">ساختار نمونه: </span>
              <span className="text-[16px]">{structure}</span>
            </p>
            <p className="flex gap-[14px] pb-[16px] text-typography-main">
              <span className="text-[18px] font-bold">جنس نمونه: </span>
              <span className="text-[16px]">{material}</span>
            </p>
            <p className="flex gap-[14px] pb-[16px] text-typography-main">
              <span className="text-[18px] font-bold">نوع نمونه : </span>
              <span className="text-[16px]">{type}</span>
            </p>
            <p className="flex gap-[14px] pb-[16px] text-typography-main">
              <span className="text-[18px] font-bold">شرایط نگهداری : </span>
              <span className="text-[16px]">{maintenance}</span>
            </p> */}
          </div>
          <div className="flex w-4/12 items-center justify-center">
            <div className="flex h-[120px] w-10/12 items-center justify-center bg-common-gray/30">
              <Image
                src={sampleData?.form_number}
                alt="دانشگاه شریف"
                width={400}
                height={500}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DescriptionForm;
