import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IcClose } from "@feature/kits/common/icons";
import { Card } from "@kit/card";
import { SvgIcon } from "@kit/svg-icon";
import { useModalHandler } from "@utils/modal-handler/config";
import { FBLoader } from "@module/form-builder/loader";
import { apiFormResponse } from "@api/service/form-response";
import { Fab } from "@kit/fab";
import { useCurrentRequestHandler } from "@hook/current-request-handler";

import { FBElementProp } from "@module/form-builder/type/sample";

export const EditSample = () => {
  const router = useRouter();
  // get current request id
  const { requestId, setRequestId } = useCurrentRequestHandler();
  // close modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get sample
  const sample = useModalHandler((state) => state.modalData);

  const queryClient = useQueryClient();

  // update sample api
  const { mutateAsync: updateFormOfSample } = useMutation(
    apiFormResponse(true, {
      success: "ویرایش نمونه موفقیت آمیز بود",
      fail: "ویرایش نمونه انجام نشد",
      waiting: "در حال انتظار",
    }).update(sample.id),
  );
  // update sample
  const updateSample = (
    json: FBElementProp[],
    values: any,
    requestId: number,
  ) => {
    const responseJson = json.map((item) => {
      const value = values[item.name ?? ""];
      if (value !== undefined) {
        return { ...item, value };
      }
      return item;
    });

    const data = {
      response_json: responseJson,
      response: "",
      request: requestId,
    };
    updateFormOfSample(data)
      .then((res) => {
        hideModal();
        // refetch data
        queryClient.invalidateQueries({
          queryKey: [apiFormResponse().url],
        });
      })
      .catch((err) => {});
  };
  return (
    <Card
      color={"white"}
      className={"h-100 max-h-[100vh] overflow-y-auto p-7 md:w-[60vw]"}
    >
      <div className="flex flex-row items-center justify-between px-3 md:mb-5">
        <h6 className="text-[22px] font-[700]">ویرایش نمونه</h6>

        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </div>
      <FBLoader
        jsonFB={sample.response_json}
        submitFB={(values) => {
          updateSample(sample.response_json, values, requestId ?? -1);
        }}
      />
    </Card>
  );
};
