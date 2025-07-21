import { CustomerProfileAttachmentsType } from "../../type";
import Image from "next/image";

const Attachments = (props: CustomerProfileAttachmentsType) => {
  const { articles, sample_images } = props;
  return (
    <>
      <h3 className="pb-[8px] pt-[24px] text-[18px] font-bold text-typography-gray">
        فایل های ضمیمه{" "}
      </h3>
      <div className="grid w-full grid-cols-2 items-start gap-[12px] rounded-[24px] bg-background-paper-light px-[24px] py-[16px] text-[18px] font-bold text-typography-main">
        <div>
          <h4 className="mb-[8px]">مقاله</h4>
          <div className="grid grid-cols-2 gap-[12px]">
            {/* {articles.map((article, index) => (
              <>
                <div
                  key={index}
                  className="h-[80px] w-full rounded-[8px] bg-typography-main/20"
                >
                  <Image
                    src={article.image}
                    width={500}
                    height={500}
                    alt="دانشگاه شریف"
                  />
                </div>
              </>
            ))} */}
          </div>
        </div>
        <div>
          <h4 className="mb-[8px]">تصاویر نمونه</h4>
          <div className="grid grid-cols-2 gap-[12px]">
            {/* {sample_images.map((sample: string, index: number) => (
              <>
                <div
                  key={index}
                  className="h-[80px] w-full rounded-[8px] bg-typography-main/20"
                >
                  <Image
                    src={sample}
                    width={500}
                    height={500}
                    alt="دانشگاه شریف"
                  />
                </div>
              </>
            ))} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Attachments;
