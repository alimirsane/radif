import Samples from "../../samples";
import PrintSample from "../../print-sample";
import PageActions from "../../page-actions";
import { CertificateParams, RequestType } from "@api/service/request/type";
import RequestParameters from "../../request-parameters";
import TestSpecifications from "../../test-specifications";
import DiscountInformation from "../../discount_information";
import RequestAppointments from "../../request-appointment";

const ChildDetails = (props: {
  request: RequestType | undefined;
  certificateData: CertificateParams | undefined;
  onClick: () => void;
  isOnlyOperatorOrTechnical: boolean;
  isOnlyOperator: boolean;
  isOnlyReception: boolean;
  parentRequestNumber: string | undefined;
  parentStatus: string;
  parentRemainingAmount: number;
}) => {
  const {
    request,
    certificateData,
    onClick,
    isOnlyOperatorOrTechnical,
    isOnlyOperator,
    isOnlyReception,
    parentRequestNumber,
    parentStatus,
    parentRemainingAmount,
  } = props;
  return (
    <>
      <div id="print-container">
        <PageActions
          request={request}
          certificateObj={certificateData}
          requestId={request?.id}
          onClick={onClick}
          isOnlyOperatorOrTechnical={isOnlyOperatorOrTechnical}
          isOnlyOperator={isOnlyOperator}
          isOnlyReception={isOnlyReception}
          parentStatus={parentStatus}
          parentRemainingAmount={parentRemainingAmount}
        />
        <TestSpecifications
          // request_number={request?.request_number}
          request_number={parentRequestNumber}
          experiment_obj={request?.experiment_obj}
          delivery_date={request?.delivery_date}
          is_urgent={request?.is_urgent}
          is_sample_returned={request?.is_sample_returned ?? false}
          price={request?.price}
          latest_status_obj={request?.latest_status_obj}
          is_cancelled={request?.is_cancelled}
        />
        <DiscountInformation
          discount={request?.discount}
          // discount_description={request?.data?.discount_description}
          // is_sample_returned={request?.data?.is_sample_returned ?? false}
          price={request?.price}
          price_sample_returned={request?.price_sample_returned}
          price_wod={request?.price_wod}
          discount_history_objs={request?.discount_history_objs}
          test_duration={request?.test_duration}
          test_unit_type={request?.experiment_obj?.test_unit_type}
        />
        {request?.experiment_obj?.need_turn && (
          <RequestAppointments
            appointments_obj={request?.appointments_obj ?? []}
          />
        )}
        <RequestParameters request_paramaters={request?.parameter_obj} />
        <Samples
          samples={request?.forms}
          is_sample_returned={request?.is_sample_returned ?? false}
          requestId={request?.request_number?.toString()}
          status={request?.latest_status_obj?.step_obj.name ?? ""}
        />
        <div className="page-break-inside">
          <PrintSample
            is_sample_returned={request?.is_sample_returned ?? false}
            samples={request?.forms}
            requestId={request?.request_number?.toString()}
            status={request?.latest_status_obj?.step_obj.name ?? ""}
          />
        </div>
        {/* {router.query.sample && (
            <DescriptionForm
              sampleData={
                request?.forms[
                  Number(router.query.sample) - 1
                ] as RequestTypeForm
              } */}

        {/* // maintenance={sample_data.maintenance}
              // material={sample_data.material}
              // name={sample_data.name}
              // structure={sample_data.structure}
              // type={sample_data.type}
              // barcode={""}
              // url={"/labs"}  */}

        {/* )} */}

        {/* <Attachments
        articles={data.attachments.articles}
        sample_images={data.attachments.sample_images}
      /> */}
      </div>
    </>
  );
};

export default ChildDetails;
