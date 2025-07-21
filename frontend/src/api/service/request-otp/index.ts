import { createInstanceCreator, ServiceBase } from "@api/service";
import { RequestOtpType } from "./type";

class ApiRequestOtp extends ServiceBase {
  override create<RES = RequestOtpType, REQ = RequestOtpType>() {
    return super.create<RES, REQ>();
  }
}

export const apiRequestOtp = createInstanceCreator(
  "/accounts/request-otp/",
  ApiRequestOtp,
);
