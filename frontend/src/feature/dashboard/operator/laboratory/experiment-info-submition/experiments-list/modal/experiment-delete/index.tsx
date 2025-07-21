import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { Fab } from "@kit/fab";
import { Card } from "@kit/card";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { apiExperiment } from "@api/service/experiment";
import { useModalHandler } from "@utils/modal-handler/config";

const ExperimentDelete = () => {
  const router = useRouter();
  const clientQuery = useQueryClient();
  // hide modal
  const hideModal = useModalHandler((state) => state.hideModal);
  // get modal data
  const experiment = useModalHandler((state) => state.modalData);
  // experiment delete api
  const { mutateAsync: deleteExperiment } = useMutation(
    apiExperiment(true, {
      success: "حذف آزمون موفقیت آمیز بود",
      fail: "حذف آزمون انجام نشد",
      waiting: "در حال انتظار",
    }).delete(experiment.id),
  );
  // delete experiment
  const deleteExperimentHandler = () => {
    deleteExperiment(experiment.id)
      .then((res) => {
        // refetch data
        clientQuery.invalidateQueries({
          queryKey: [apiExperiment().url],
        });
        hideModal();
      })
      .catch((err) => {});
  };

  return (
    <Card color={"white"} className="w-[90vw] p-6 md:w-[40vw] lg:w-[30vw]">
      <span className="mb-[16px] flex flex-row items-center justify-between">
        <h6 className="text-[20px] font-[700]">حذف آزمون</h6>
        <Fab className="bg-error-light bg-opacity-60 p-1" onClick={hideModal}>
          <SvgIcon fillColor={"black"}>
            <IcClose />
          </SvgIcon>
        </Fab>
      </span>
      <Card
        color={"info"}
        className="mb-8 mt-7 px-4 py-7 text-center text-[14px]"
      >
        آیا از حذف آزمون &quot;{experiment.name}&quot; اطمینان دارید؟
      </Card>
      <div className="flex justify-center gap-[12px] pb-1">
        <Button className="w-[100px] " variant="outline" onClick={hideModal}>
          خیر
        </Button>
        <Button className="w-[100px] " onClick={deleteExperimentHandler}>
          بله
        </Button>
      </div>
    </Card>
  );
};

export default ExperimentDelete;
