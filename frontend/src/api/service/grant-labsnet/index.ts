import { createInstanceCreator, ServiceBase } from "@api/service";
import { LabsnetGrantType } from "./type";

class ApiGrantLabsnet extends ServiceBase {
  override create<
    RES = Pick<LabsnetGrantType, "customer_name" | "credits">,
    REQ = Pick<LabsnetGrantType, "national_id" | "type" | "services">,
  >() {
    return super.create<RES, REQ>();
  }
}

export const apiGrantLabsnet = createInstanceCreator(
  "/accounts/grant-labsnet/",
  ApiGrantLabsnet,
);
