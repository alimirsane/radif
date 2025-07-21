import { ModalKeys, useModalHandler } from "./config";
import { Modal } from "@kit/modal";
import { ModalLayout } from "@feature/kits/modal";
import { ParametersList } from "@feature/dashboard/customer/request/test-selection-step/modal/parameter-list";
import { EditSample } from "@feature/dashboard/customer/request/final-approval-step/sample-data-card/modal/edit";

import Granted from "@feature/dashboard/operator/grant/modal/granted";
import CreateParameter from "@feature/dashboard/operator/laboratory/parameter-info-submition/modal/create-parameter";
import SubmitParameters from "@feature/dashboard/operator/laboratory/parameter-info-submition/modal/submit-parameters";
import EditUser from "@feature/dashboard/operator/users/list/modal/edit-user";
import LaboratoryDetails from "@feature/dashboard/operator/laboratory/laboratories-list/modal/lab-details";
import DeviceDetails from "@feature/dashboard/operator/laboratory/device-info-submition/devices-list/modal/device-details";
import EditDevice from "@feature/dashboard/operator/laboratory/device-info-submition/devices-list/modal/device-edit";
import DeviceDelete from "@feature/dashboard/operator/laboratory/device-info-submition/devices-list/modal/device-delete";
import EditParameter from "@feature/dashboard/operator/laboratory/parameter-info-submition/modal/edit-parameter";
import DeleteParameter from "@feature/dashboard/operator/laboratory/parameter-info-submition/modal/delete-parameter";
import EditLab from "@feature/dashboard/operator/laboratory/laboratories-list/modal/lab-edit";
import EditExperiment from "@feature/dashboard/operator/laboratory/experiment-info-submition/experiments-list/modal/experiment-edit";
import ExperimentDelete from "@feature/dashboard/operator/laboratory/experiment-info-submition/experiments-list/modal/experiment-delete";
import ViewExperiment from "@feature/dashboard/operator/laboratory/experiment-info-submition/experiments-list/modal/experiment-view";
import AddUser from "@feature/dashboard/operator/users/list/modal/add-user";
import DeleteForm from "@feature/dashboard/operator/laboratory/forms-list/modal/delete-form";
import ViewForm from "@feature/dashboard/operator/laboratory/forms-list/modal/view-form";
import ChoosTime from "@feature/dashboard/customer/request/test-selection-step/modal/choos-time";
import CancelGrant from "@feature/dashboard/operator/grant/modal/cancel-grant-request";
import RejectRequest from "@feature/dashboard/operator/component/template/components/page-actions/reject-request";
import UploadResult from "@feature/dashboard/operator/component/template/components/page-actions/upload-result";
import { AccessLevel } from "@feature/dashboard/common/access-level";
import DeleteGrant from "@feature/dashboard/operator/grant-record/grants-list/modal/delete-grant";
import CreateGrant from "@feature/dashboard/operator/grant-record/grants-list/modal/add-grant";
import EditGrant from "@feature/dashboard/operator/grant-record/grants-list/modal/edit-grant";
import ChangePassword from "@feature/dashboard/customer/profile/change-password";
import { AccountSwitcher } from "@feature/auth/signin/account-swicher";
import RequestDiscount from "@feature/dashboard/operator/component/template/components/page-actions/request-discount";
import RequestHistory from "@feature/dashboard/operator/component/template/components/page-actions/request-history";
import CopySample from "@feature/dashboard/customer/request/sample-data-entry/modal/copy-sample";
import SampleDelete from "@feature/dashboard/customer/request/final-approval-step/sample-data-card/modal/delete";
import CreateGroupGrant from "@feature/dashboard/operator/grant-record/grants-list/modal/add-group-grant";
import EditPassword from "@feature/dashboard/operator/users/list/modal/change-password";
import ViewUser from "@feature/dashboard/operator/users/list/modal/view-user";
import ViewParameter from "@feature/dashboard/operator/laboratory/parameter-info-submition/modal/view-parameter";
import RequestTrefCode from "@feature/dashboard/operator/component/template/components/page-actions/request-tref-code";
import DiscountHistory from "@feature/dashboard/operator/component/template/components/discount_information/discount-history";
import RequestLabsnetDiscount from "@feature/dashboard/operator/component/template/components/page-actions/labsnet-discount";
import DisplayGrantsList from "@feature/dashboard/operator/grant/modal/grants-list";
import AddCustomer from "@feature/dashboard/operator/users/list/modal/add-customer";
import ChangeUserType from "@feature/dashboard/operator/users/list/modal/change-type";
import LabsnetGrantsList from "@feature/dashboard/customer/list-requests/components/parent-request-cost/modal/labsnet-grants-list";
import EditPaymentRecord from "@feature/dashboard/operator/transaction/modal/edit-payment-record";
import AddPaymentRecord from "@feature/dashboard/operator/transaction/modal/create-payment-record";
import DeleteTransaction from "@feature/dashboard/operator/transaction/modal/delete-payment-record";
import LockTransaction from "@feature/dashboard/operator/transaction/modal/lock-payment-record";
import ParentRequestFinancialInfo from "@feature/dashboard/customer/list-requests/components/parent-request-cost/modal/financial-information";
import RevokeGrant from "@feature/dashboard/operator/grant/modal/revoke-grant";
import ResearchGrantsList from "@feature/dashboard/customer/list-requests/components/parent-request-cost/modal/research-grants-list";
import TransactionsContradiction from "@feature/dashboard/operator/transaction/modal/contradiction";
import PreviewLabImage from "@feature/dashboard/operator/laboratory/lab-info-submition/create-laboratory/modal/preview-lab-image";
import AcceptRequest from "@feature/dashboard/operator/component/template/components/page-actions/accept-request";
import RequestsListUserGuide from "@feature/dashboard/common/user-guide/modal/requests-list-user-guide";
import LabsnetGrantReport from "@feature/dashboard/operator/component/template/components/request-cost/modal/labsnet-grant-report";
import DeleteUser from "@feature/dashboard/operator/users/list/modal/delete-user";
import CropLabImage from "@feature/dashboard/operator/laboratory/lab-info-submition/create-laboratory/modal/crop-lab-image";
import ExperimentDuration from "@feature/dashboard/operator/component/template/components/page-actions/experiment-duration";
import UpdateIsoStatus from "@feature/dashboard/operator/iso/modal/update-iso-status";
import SignupRules from "@feature/auth/signup/form/modal/rules";
import DeviceDetail from "@feature/dashboard/customer/request/test-selection-step/laboratory-tests-list/modal";
import SetAppointment from "@feature/dashboard/operator/laboratory/experiment-info-submition/experiments-list/modal/experiment-appointment";
import SelectAppointment from "@feature/dashboard/customer/request/final-approval-step/modal/appointment";
import QueueEdit from "@feature/dashboard/operator/laboratory/experiment-info-submition/appointments/modal/edit-queue";
import QueueDelete from "@feature/dashboard/operator/laboratory/experiment-info-submition/appointments/modal/delete-queue";
import RequestResult from "@feature/dashboard/customer/list-requests/components/list-item/open-list-item/modal/request-results";
import QueueStatusEdit from "@feature/dashboard/operator/laboratory/experiment-info-submition/appointments/modal/edit-queue-status";
import AppointmentInfo from "@feature/dashboard/operator/laboratory/experiment-info-submition/appointments/modal/appointment-info";
import CancelAppointment from "@feature/dashboard/customer/appointments/modal/cancel-appointmnet";
import GrantSelfAssignment from "@feature/dashboard/operator/grant/modal/grant-self-assignment";
import AppointmentsInfo from "@feature/dashboard/customer/list-requests/components/child-request/modal/appointments-info";
import { InactiveResource } from "@feature/dashboard/customer/request/parameter-selection-step/modal/inactive-resource";
import { RedirectToPrePayment } from "@feature/dashboard/customer/request/view-sub-requests/modal/redirect-to-prepayment";
import { RequestFlowDescription } from "@feature/dashboard/customer/request/test-selection/modal/request-flow-description";

const ModalHandler = () => {
  const modalKey = useModalHandler((state) => state.modalKey);

  switch (modalKey) {
    case ModalKeys.SAMPLE:
      return (
        <Modal>
          <ModalLayout />
        </Modal>
      );
    case ModalKeys.SAMPLE_FULL_SCREEN_MD:
      return (
        <Modal fullscreen={"md"}>
          <ModalLayout />
        </Modal>
      );
    case ModalKeys.SAMPLE_DISMISS_OUTSIDE:
      return (
        <Modal dismissOutside>
          <ModalLayout />
        </Modal>
      );

    case ModalKeys.REQUEST_PARAMETERS_LIST:
      return (
        <Modal>
          <ParametersList />
        </Modal>
      );

    case ModalKeys.REDIRECT_TO_PREPAYMENT:
      return (
        <Modal>
          <RedirectToPrePayment />
        </Modal>
      );

    case ModalKeys.REQUEST_FLOW_DESCRIPTION:
      return (
        <Modal>
          <RequestFlowDescription />
        </Modal>
      );

    case ModalKeys.INACTIVE_RESOURCE:
      return (
        <Modal>
          <InactiveResource />
        </Modal>
      );

    case ModalKeys.REQUEST_DEVICE_DETAIL:
      return (
        <Modal>
          <DeviceDetail />
        </Modal>
      );

    case ModalKeys.OPERATOR_CREATE_PARAMETER:
      return (
        <Modal fullscreen={"md"}>
          <CreateParameter />
        </Modal>
      );

    case ModalKeys.OPERATOR_SUBMIT_PARAMETER_DIALOG:
      return (
        <Modal>
          <SubmitParameters />
        </Modal>
      );

    case ModalKeys.OPERATOR_LABORATORY_DETAILS:
      return (
        <Modal fullscreen={"md"}>
          <LaboratoryDetails />
        </Modal>
      );

    case ModalKeys.OPERATOR_DEVICE_DETAILS:
      return (
        <AccessLevel module={"device"} permission={["view"]}>
          <Modal fullscreen={"md"}>
            <DeviceDetails />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.OPERATOR_EDIT_DEVICE:
      return (
        <AccessLevel module={"device"} permission={["update"]}>
          <Modal fullscreen={"md"}>
            <EditDevice />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.OPERATOR_SET_APPOINTMENT:
      return (
        <Modal fullscreen={"md"}>
          <SetAppointment />
        </Modal>
      );

    case ModalKeys.OPERATOR_EDIT_QUEUE:
      return (
        <Modal>
          <QueueEdit />
        </Modal>
      );

    case ModalKeys.OPERATOR_EDIT_QUEUE_STATUS:
      return (
        <Modal>
          <QueueStatusEdit />
        </Modal>
      );

    case ModalKeys.OPERATOR_DELETE_QUEUE:
      return (
        <Modal>
          <QueueDelete />
        </Modal>
      );

    case ModalKeys.VIEW_APPOINTMENT_INFO:
      return (
        <Modal>
          <AppointmentInfo />
        </Modal>
      );

    case ModalKeys.CUSTOMER_SELECT_APPOINTMENT:
      return (
        <Modal fullscreen={"md"}>
          <SelectAppointment />
        </Modal>
      );

    case ModalKeys.CUSTOMER_CANCEL_APPOINTMENT:
      return (
        <Modal fullscreen={"md"}>
          <CancelAppointment />
        </Modal>
      );

    case ModalKeys.OPERATOR_EDIT_EXPERIMENT:
      return (
        <Modal fullscreen={"md"}>
          <EditExperiment />
        </Modal>
      );

    case ModalKeys.CHOOS_TIME:
      return (
        <Modal fullscreen={"md"}>
          <ChoosTime />
        </Modal>
      );

    case ModalKeys.OPERATOR_VIEW_EXPERIMENT:
      return (
        <Modal fullscreen={"md"}>
          <ViewExperiment />
        </Modal>
      );

    case ModalKeys.OPERATOR_EDIT_PARAMETER:
      return (
        <Modal fullscreen={"md"}>
          <EditParameter />
        </Modal>
      );

    case ModalKeys.OPERATOR_VIEW_PARAMETER:
      return (
        <Modal fullscreen={"md"}>
          <ViewParameter />
        </Modal>
      );

    case ModalKeys.EDIT_SAMPLE:
      return (
        <Modal>
          <EditSample />
        </Modal>
      );

    case ModalKeys.DELETE_SAMPLE:
      return (
        <Modal>
          <SampleDelete />
        </Modal>
      );

    case ModalKeys.GRANTED:
      return (
        <Modal>
          <Granted />
        </Modal>
      );

    case ModalKeys.GRANTS_LIST:
      return (
        <Modal fullscreen={"md"}>
          <DisplayGrantsList />
        </Modal>
      );

    case ModalKeys.GRANT_SELF_ASSIGNMENT:
      return (
        <Modal>
          <GrantSelfAssignment />
        </Modal>
      );

    case ModalKeys.CANCEL_GRANT_REQUEST:
      return (
        <Modal>
          <CancelGrant />
        </Modal>
      );

    case ModalKeys.REVOKE_GRANT_REQUEST:
      return (
        <Modal>
          <RevokeGrant />
        </Modal>
      );

    case ModalKeys.EDIT_PAYMENT_RECORD:
      return (
        <Modal>
          <EditPaymentRecord />
        </Modal>
      );
    case ModalKeys.CREATE_PAYMENT_RECORD:
      return (
        <Modal>
          <AddPaymentRecord />
        </Modal>
      );
    case ModalKeys.DELETE_PAYMENT_RECORD:
      return (
        <Modal>
          <DeleteTransaction />
        </Modal>
      );
    case ModalKeys.CONTRADICTION_PAYMENT_RECORDS:
      return (
        <Modal>
          <TransactionsContradiction />
        </Modal>
      );
    case ModalKeys.LOCK_PAYMENT_RECORD:
      return (
        <Modal>
          <LockTransaction />
        </Modal>
      );
    case ModalKeys.EDIT_USER:
      return (
        <AccessLevel module={"user"} permission={["update"]}>
          <Modal>
            <EditUser />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.VIEW_USER:
      return (
        <Modal>
          <ViewUser />
        </Modal>
      );
    case ModalKeys.DELETE_USER:
      return (
        <Modal>
          <DeleteUser />
        </Modal>
      );
    case ModalKeys.CHANGE_USER_PASSWORD:
      return (
        <AccessLevel module={"user"} permission={["update"]}>
          <Modal>
            <EditPassword />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.CHANGE_USER_TYPE:
      return (
        <AccessLevel module={"user"} permission={["update"]}>
          <Modal>
            <ChangeUserType />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.ADD_USER:
      return (
        <AccessLevel module={"user"} permission={["create"]}>
          <Modal>
            <AddUser />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.ADD_CUSTOMER:
      return (
        <AccessLevel module={"user"} permission={["create"]}>
          <Modal>
            <AddCustomer />
          </Modal>
        </AccessLevel>
      );
    case ModalKeys.OPERATOR_DELETE_DEVICE:
      return (
        <AccessLevel module={"device"} permission={["delete"]}>
          <Modal>
            <DeviceDelete />
          </Modal>
        </AccessLevel>
      );

    case ModalKeys.OPERATOR_DELETE_EXPERIMENT:
      return (
        <Modal>
          <ExperimentDelete />
        </Modal>
      );

    case ModalKeys.OPERATOR_DELETE_PARAMETER:
      return (
        <Modal>
          <DeleteParameter />
        </Modal>
      );
    case ModalKeys.OPERATOR_EDIT_LAB:
      return (
        <Modal fullscreen={"md"}>
          <EditLab />
        </Modal>
      );

    case ModalKeys.OPERATOR_DELETE_FORM:
      return (
        <Modal>
          <DeleteForm />
        </Modal>
      );

    case ModalKeys.OPERATOR_VIEW_FORM:
      return (
        <Modal>
          <ViewForm />
        </Modal>
      );

    case ModalKeys.REJECT_REQUEST:
      return (
        <Modal>
          <RejectRequest />
        </Modal>
      );

    case ModalKeys.ACCEPT_REQUEST:
      return (
        <Modal>
          <AcceptRequest />
        </Modal>
      );

    case ModalKeys.OPERATOR_DELETE_GRANT:
      return (
        <Modal>
          <DeleteGrant />
        </Modal>
      );

    case ModalKeys.OPERATOR_EDIT_GRANT:
      return (
        <Modal>
          <EditGrant />
        </Modal>
      );

    case ModalKeys.OPERATOR_CREATE_GRANT:
      return (
        <Modal>
          <CreateGrant />
        </Modal>
      );

    case ModalKeys.OPERATOR_CREATE_GROUP_GRANT_LIST:
      return (
        <Modal>
          <CreateGroupGrant />
        </Modal>
      );

    case ModalKeys.UPLOAD_RESULT:
      return (
        <Modal>
          <UploadResult />
        </Modal>
      );

    case ModalKeys.CUSTOMER_REQUEST_RESULT:
      return (
        <Modal>
          <RequestResult />
        </Modal>
      );

    case ModalKeys.CUSTOMER_APPOINTMENTS_INFO:
      return (
        <Modal>
          <AppointmentsInfo />
        </Modal>
      );

    case ModalKeys.REQUEST_DISCOUNT:
      return (
        <Modal>
          <RequestDiscount />
        </Modal>
      );

    case ModalKeys.EXPERIMENT_DURATION:
      return (
        <Modal>
          <ExperimentDuration />
        </Modal>
      );

    case ModalKeys.DISCOUNT_HISTORY:
      return (
        <Modal>
          <DiscountHistory />
        </Modal>
      );

    case ModalKeys.REQUEST_TREF_CODE:
      return (
        <Modal>
          <RequestTrefCode />
        </Modal>
      );

    case ModalKeys.REQUEST_LABSNET_DISCOUNT:
      return (
        <Modal>
          <RequestLabsnetDiscount />
        </Modal>
      );

    case ModalKeys.REQUEST_HISTORY:
      return (
        <Modal>
          <RequestHistory />
        </Modal>
      );
    case ModalKeys.LABSNET_GRANTS_REPORT:
      return (
        <Modal>
          <LabsnetGrantReport />
        </Modal>
      );
    case ModalKeys.LABSNET_GRANTS_LIST:
      return (
        <Modal>
          <LabsnetGrantsList />
        </Modal>
      );
    case ModalKeys.RESEARCH_GRANTS_LIST:
      return (
        <Modal>
          <ResearchGrantsList />
        </Modal>
      );
    case ModalKeys.PARENT_REQUEST_FINANCIAL_INFO:
      return (
        <Modal>
          <ParentRequestFinancialInfo />
        </Modal>
      );
    case ModalKeys.CUSTOMER_CHANGE_PASSWORD:
      return (
        <Modal>
          <ChangePassword />
        </Modal>
      );

    case ModalKeys.SELECT_ACCOUNT_TYPE:
      return (
        <Modal>
          <AccountSwitcher />
        </Modal>
      );

    case ModalKeys.COPY_SAMPLE:
      return (
        <Modal>
          <CopySample />
        </Modal>
      );

    case ModalKeys.PREVIEW_LAB_IMAGE:
      return (
        <Modal>
          <PreviewLabImage />
        </Modal>
      );

    case ModalKeys.CROP_LAB_IMAGE:
      return (
        <Modal>
          <CropLabImage />
        </Modal>
      );

    case ModalKeys.REQUESTS_LIST_USER_GUIDE:
      return (
        <Modal fullscreen={"md"}>
          <RequestsListUserGuide />
        </Modal>
      );

    case ModalKeys.UPDATE_ISO:
      return (
        <Modal>
          <UpdateIsoStatus />
        </Modal>
      );

    case ModalKeys.SIGN_UP_RULES:
      return (
        <Modal fullscreen={"md"}>
          <SignupRules />
        </Modal>
      );
    default:
      return <></>;
  }
};

export default ModalHandler;
