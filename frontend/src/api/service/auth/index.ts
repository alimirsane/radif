import { createInstanceCreator, ServiceBase } from "@api/service";
import { SignInType } from "@api/service/auth/type/sign-in";
import {
  BusinessSignUpType,
  PersonalSignUpType,
  SignUpType,
} from "@api/service/auth/type/sign-up";

class ApiAuth extends ServiceBase {
  override create<
    RES = Omit<SignInType, "username" | "password" | "otp">,
    REQ = Omit<SignInType, "token">,
  >() {
    return super.create<RES, REQ>();
  }

  signIn = () =>
    super.mutateRare<
      Omit<SignInType, "username" | "password" | "otp">,
      Omit<SignInType, "token" | "business_accounts">
    >("post", { url: this.url + "token-auth/" });

  personalSignUp = () =>
    super.mutate<PersonalSignUpType, PersonalSignUpType>("post", {
      url: this.url + "register/personal/",
    });

  businessSignUp = () =>
    super.mutate<BusinessSignUpType, BusinessSignUpType>("post", {
      url: this.url + "register/business/",
    });

  sendSharifData<RES, REQ>(params?: {}) {
    return super.create<RES, REQ>({ params, url: this.url + "sso/verify/" });
  }
}

export const apiAuth = createInstanceCreator("/accounts/", ApiAuth);
