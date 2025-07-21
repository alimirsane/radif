import { Button } from "@kit/button";
import { Card } from "@kit/card";
import { TextArea } from "@kit/text-area";
import { useModalHandler } from "@utils/modal-handler/config";
import { apiRequest } from "@api/service/request";
import { apiWorkflow } from "@api/service/workflow";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import * as yup from "yup";
import { useMemo, useState } from "react";
import { Fab } from "@kit/fab";
import { SvgIcon } from "@kit/svg-icon";
import { IcClose } from "@feature/kits/common/icons";
import { routes } from "@data/routes";
import { apiNotification } from "@api/service/notifications";
import { apiAppointment } from "@api/service/appointment";
import { RequestType } from "@api/service/request/type";

const RejectRequest = () => {
  const router = useRouter();
  const hideModal = useModalHandler((state) => state.hideModal);
  const modalData = useModalHandler((state) => state.modalData);
  const clientQuery = useQueryClient();
  // const [appointmentId, setAppointmentId] = useState(-1);
  const isCustomer = useMemo(() => {
    return router.asPath.includes(routes.customer());
  }, [router]);
  // **********
  // delete appointment api
  // const { mutateAsync } = useMutation(
  //   apiAppointment(false).deleteAppointment(appointmentId),
  // );

  // const cancelAppointmentHandler = (id: number) => {
  //   mutateAsync(id)
  //     .then((res) => {})
  //     .catch((err) => {
  //       router.query.action = "cancel";
  //       router.push(router);
  //       hideModal();
  //     });
  // };
  // **********
  const { mutateAsync: updateRequestStatus } = useMutation(
    apiRequest(true).updateRequestStatus(modalData?.requestId ?? -1),
  );
  const { mutateAsync: cancelByCustomer } = useMutation(
    apiRequest(false).cancelByCustomer(modalData?.requestId ?? -1),
  );
  const cancelRequestByCustomer = () => {
    const data = {
      is_cancelled: true,
    };
    cancelByCustomer(data)
      .then((res) => {
        // refetch requests data
        clientQuery.invalidateQueries({
          queryKey: [apiRequest().url],
        });
        // if (modalData?.type === "main_request") {
        //   modalData?.children?.forEach((child: RequestType, index: number) => {
        //     child.appointments_obj?.forEach((appointment) => {
        //       // setAppointmentId(appointment.id ?? -1);
        //       cancelAppointmentHandler(appointment.id ?? -1);
        //       if (index === child.appointments_obj?.length) {
        //         router.query.action = "cancel";
        //         router.push(router);
        //         hideModal();
        //       }
        //     });
        //   });
        // }
        // if (modalData?.type === "child_request") {
        //   modalData?.appointmentsObj?.forEach(
        //     (appointment: any, index: number) => {
        //       // setAppointmentId(appointment.id ?? -1);
        //       cancelAppointmentHandler(appointment.id ?? -1);
        //       if (index === modalData?.appointmentsObj?.length) {
        //         router.query.action = "cancel";
        //         router.push(router);
        //         hideModal();
        //       }
        //     },
        //   );
        // }
        router.query.action = "cancel";
        router.push(router);
        hideModal();
      })
      .catch((err) => {});
  };
  const rejectHandler = (values: { description: string }) => {
    const data = {
      description: values.description,
      action: "reject",
    };
    updateRequestStatus(data)
      .then((res) => {
        if (isCustomer) {
          cancelRequestByCustomer();
        } else {
          // change router query
          if (router.query.hasOwnProperty("request_status")) {
            delete router.query.request_status;
            // router.push(router);
          }
          delete router.query.request_id;
          router.push(router);
          hideModal();
          // refetch data
          clientQuery.invalidateQueries({
            queryKey: [apiWorkflow().url],
          });
          clientQuery.invalidateQueries({
            queryKey: [apiRequest().url],
          });
          clientQuery.invalidateQueries({
            queryKey: [apiNotification().url],
          });
        }
      })
      .catch((err) => {});
  };
  const validationSchema = useMemo(() => {
    return yup.object({
      description: validation.requiredInput,
    });
  }, []);

  return (
    <FormHandler
      initialValues={{ description: "" }}
      validationSchema={validationSchema}
      handleSubmit={(values, utils) => {
        rejectHandler(values);
      }}
    >
      {(formik) => (
        <Card
          color="white"
          className="2xl:w-[30vw] w-[90vw] p-6 sm:w-[50vw] xl:w-[40vw]"
        >
          <span className="mb-9 flex flex-row items-center justify-between">
            <h2 className="text-[20px] font-[700]">
              {isCustomer ? "لغو" : "رد"} درخواست
            </h2>
            <Fab
              className="bg-error-light bg-opacity-60 p-1"
              onClick={hideModal}
            >
              <SvgIcon fillColor={"black"}>
                <IcClose />
              </SvgIcon>
            </Fab>
          </span>
          <TextArea
            formik={formik}
            name="description"
            label={`علت ${isCustomer ? "لغو" : "رد"} درخواست`}
            placeholder={`توضیحات ${isCustomer ? "لغو" : "رد"} درخواست را وارد نمایید`}
          />
          <div className="mt-6 flex justify-end gap-3">
            {/* <Button variant="outline" onClick={() => hideModal()}>
              لغو
            </Button> */}
            <Button type="submit">{isCustomer ? "لغو" : "رد"} درخواست</Button>
          </div>
        </Card>
      )}
    </FormHandler>
  );
};

export default RejectRequest;
