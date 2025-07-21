import { routes } from "@data/routes";
export type RouteValues =
  | ReturnType<typeof routes.index>
  | ReturnType<typeof routes.kits>
  | ReturnType<typeof routes.operator>
  | ReturnType<typeof routes.operatorUsers>
  | ReturnType<typeof routes.operatorReports>
  | ReturnType<typeof routes.operatorRequest>
  | ReturnType<typeof routes.operatorLaboratoryList>
  | ReturnType<typeof routes.operatorMessages>
  | ReturnType<typeof routes.operatorGrants>
  | ReturnType<typeof routes.operatorGrantRequests>
  | ReturnType<typeof routes.operatorTransaction>
  | ReturnType<typeof routes.operatorTickets>
  | ReturnType<typeof routes.customer>
  | ReturnType<typeof routes.customerRequest>
  | ReturnType<typeof routes.customerRequestsList>
  | ReturnType<typeof routes.customerMessages>
  | ReturnType<typeof routes.customerPayment>
  | ReturnType<typeof routes.customerPaymentConfirm>
  | ReturnType<typeof routes.customerProfile>
  | ReturnType<typeof routes.customerGrantRequests>
  | ReturnType<typeof routes.customerWallet>
  | ReturnType<typeof routes.customerFinancialReport>
  | ReturnType<typeof routes.customerRequestsDetails>
  | ReturnType<typeof routes.signIn>
  | ReturnType<typeof routes.signup>
  | ReturnType<typeof routes.resetPassword>;
