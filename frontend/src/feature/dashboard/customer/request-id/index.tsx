import Container from "@feature/dashboard/common/container";
import StatusBar from "./components/status-bar";
import ApplicationInformation from "./components/application-information";
import SampleInformation from "./components/sample-information";
import FinancialInformation from "./components/financial-information";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@api/service/request";
import { useParams } from "next/navigation";
import ParameterInformation from "./components/parameter-information";
import PriceInformation from "./components/price-information";
import AppointmentInformation from "./components/appointment-information";

const RequestId = () => {
  const params: { id: string } = useParams();
  const { data: request, isLoading } = useQuery(
    apiRequest().getById(params?.id),
  );
  return (
    <Container>
      {/* <StatusBar statusList={data?.data.status_objs ?? []} /> */}
      <ApplicationInformation />
      <SampleInformation />
      <div className="mt-[32px]">
        <ParameterInformation
          parameterList={request?.data.parameter_obj ?? []}
          isUrgent={request?.data.is_urgent ?? false}
        />
      </div>
      {request?.data?.experiment_obj?.need_turn && (
        <AppointmentInformation
          appointments_obj={request?.data?.appointments_obj ?? []}
          request_status={
            request?.data?.latest_status_obj?.step_obj?.name ?? ""
          }
        />
      )}
      <PriceInformation
        discount={request?.data?.discount}
        price={request?.data?.price}
        price_sample_returned={request?.data?.price_sample_returned}
        price_wod={request?.data?.price_wod}
      />
      {/* <FinancialInformation
        paymentRecords={request?.data.payment_record_objs}
        is_returned={request?.data.is_returned ?? false}
      /> */}
    </Container>
  );
};

export default RequestId;
