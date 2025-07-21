import { createInstanceCreator, ServiceBase } from "@api/service";
import { VerifyOtpType } from "./type";

class ApiVerifyOtp extends ServiceBase {
  override create<RES = VerifyOtpType, REQ = VerifyOtpType>() {
    return super.create<RES, REQ>();
  }
}

export const apiVerifyOtp = createInstanceCreator(
  "/accounts/verify-otp/",
  ApiVerifyOtp,
);
