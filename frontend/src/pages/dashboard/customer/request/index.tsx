import Container from "@feature/dashboard/common/container";
import Header from "@feature/dashboard/common/header";
import Request from "@feature/dashboard/customer/request";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { useEffect, useMemo } from "react";
import { apiUser } from "@api/service/user";
import { useCurrentRequestHandler } from "@hook/current-request-handler";
import { ModalKeys, useModalHandler } from "@utils/modal-handler/config";

const CustomerRequest = () => {
  const requestId = useCurrentRequestHandler((state) => state.requestId);
  const resetRequestId = useCurrentRequestHandler(
    (state) => state.resetRequestId,
  );
  const openModal = useModalHandler((state) => state.openModal);

  const { data: currentRequest } = useQuery({
    ...apiRequest().getById(requestId?.toString()),
    enabled: requestId !== undefined,
  });

  useEffect(() => {
    resetRequestId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = useMemo(() => {
    return (
      "ثبت درخواست جدید" +
      (currentRequest?.data.experiment_obj?.name
        ? "“" + currentRequest?.data.experiment_obj?.name + "”"
        : "")
    );
  }, [currentRequest?.data.experiment_obj?.name]);

  const { data: user } = useQuery({
    ...apiUser().me(),
  });

  return (
    <Container>
      <Header
        title={title}
        description="از این بخش می‌توانید برای ثبت درخواست خود اقدام کنید."
      />
      <div className="" onClick={() => openModal(ModalKeys.CHOOS_TIME)}></div>
      <Request />
    </Container>
  );
};

export default CustomerRequest;
