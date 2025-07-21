import { createInstanceCreator, ServiceBase } from "@api/service";
import { CurrentUserType, LabsnetGrantListType } from "./type/current-user";

class ApiUser extends ServiceBase {
  override getAll<RES = unknown>() {
    return super.getAll<RES>();
  }
  getAllList<RES = unknown>(params?: {}) {
    return super.getAllPagination<RES>({ params });
  }
  getFileUrl<RES = CurrentUserType>(params?: {}) {
    return super.query<RES>({ params });
  }
  getCustomerFileUrl<RES = CurrentUserType>(params?: {}) {
    return super.query<RES>({ params, url: this.url + "customer/" });
  }
  getStaffFileUrl<RES = CurrentUserType>(params?: {}) {
    return super.query<RES>({ params, url: this.url + "staff/" });
  }
  override getById<RES = unknown>(departmentId: string) {
    return super.getById<RES>(departmentId);
  }
  getAllMine<RES = CurrentUserType>(params?: {}) {
    return super.getAll<RES>({ params });
  }
  getAllMineList<RES = Array<CurrentUserType>>(params?: {}) {
    return super.getAllPagination<RES>({ params });
  }

  getAllCustomers<RES = CurrentUserType[]>(params?: {}) {
    return super.getAllPagination<RES>({
      params,
      url: this.url + "customer/",
    });
  }
  getAllStaffs<RES = CurrentUserType[]>(params?: {}) {
    return super.getAllPagination<RES>({
      params,
      url: this.url + "staff/",
    });
  }

  getAllPublicCustomers<RES = CurrentUserType>(params?: {}) {
    return super.getAll<RES>({
      params,
      url: this.url + "customer/pub/",
    });
  }
  getAllPublicStaffs<RES = CurrentUserType>(params?: {}) {
    return super.getAll<RES>({
      params,
      url: this.url + "staff/pub/",
    });
  }

  getAllTeachers<RES = CurrentUserType>(params?: {}) {
    return super.getAll<RES>({
      params,
      url: this.url + "teacher/",
    });
  }

  update<
    RES = CurrentUserType,
    REQ = Pick<
      CurrentUserType,
      | "password"
      | "first_name"
      | "last_name"
      | "email"
      | "student_id"
      | "educational_level"
      | "educational_field"
      | "postal_code"
    >,
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/" });
  }

  updatePassword<
    RES = CurrentUserType,
    REQ = Pick<CurrentUserType, "password">,
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/password/" });
  }

  changeUserType<
    RES = CurrentUserType,
    REQ = Pick<
      CurrentUserType,
      "user_type" | "national_id" | "username" | "role"
    >,
  >(itemId: string | undefined) {
    return super.updateAll<RES, REQ>({ url: this.url + itemId + "/" });
  }

  updateMyprofile<
    RES = CurrentUserType,
    REQ = Pick<
      CurrentUserType,
      | "password"
      | "first_name"
      | "last_name"
      | "email"
      | "student_id"
      | "educational_level"
      | "educational_field"
      | "postal_code"
      | "address"
      | "department"
      | "telephone"
      | "is_sharif_student"
    >,
  >() {
    return super.updateSome<RES, REQ>({ url: this.url + "my-profile/" });
  }

  override create<RES = unknown, REQ = Omit<unknown, "id">>() {
    return super.create<RES, REQ>();
  }

  me = () => super.query<CurrentUserType>({ url: "/accounts/current-user/" });

  getMyLabsnetGrants<RES = LabsnetGrantListType>() {
    return super.query<RES>({ url: "/accounts/current-user/labsnet/" });
  }

  override delete<RES = CurrentUserType>(userId: string) {
    return super.delete<RES>(userId);
  }
}

export const apiUser = createInstanceCreator("/accounts/users/", ApiUser);
