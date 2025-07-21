import { Input } from "@kit/input";
import { useQuery } from "@tanstack/react-query";
import { useModalHandler } from "@utils/modal-handler/config";
import { CurrentUserType } from "@api/service/user/type/current-user";
import { AccountType } from "@api/service/user/type/account-type";
import { apiEducationalField } from "@api/service/educational-field";
import { apiEducationalLevel } from "@api/service/educational-levels";
import { useMemo } from "react";
import { useRouter } from "next/router";
import { apiDepartment } from "@api/service/department";

const ViewUserForm = () => {
  const router = useRouter();
  const isCustomer = useMemo(() => {
    return router.asPath.includes("customer");
  }, [router]);

  const { data: educationFields } = useQuery(apiEducationalField().getAll());
  const { data: educationLevels } = useQuery(apiEducationalLevel().getAll());
  const { data: departments } = useQuery(apiDepartment().getAll());
  const user: CurrentUserType = useModalHandler((state) => state.modalData);
  return (
    <div>
      <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2">
        <Input
          label={"نام"}
          value={user.first_name}
          disabled
          className="bg-background-paper"
        />
        <Input
          label={"نام خانوادگی"}
          defaultValue={user.last_name}
          disabled
          className="bg-background-paper"
        />
        {user.account_type === AccountType.PERSONAL ? (
          <>
            <Input
              label={"کد ملی"}
              value={user.national_id}
              disabled
              className="bg-background-paper"
            />
            <Input
              value={
                user.role_obj && user.role_obj.length > 0
                  ? user.role_obj.map((role: any) => role.name).join("، ")
                  : "---"
              }
              label={"سمت"}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"شماره همراه"}
              value={
                user.username
                  ? `0${user?.username.slice(3, user?.username.length)}`
                  : ""
              }
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"تلفن"}
              value={user.telephone ?? "---"}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"ایمیل"}
              value={user.email?.length ? user.email : "---"}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"شماره دانشجویی"}
              value={user.student_id?.length ? user.student_id : "---"}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"مقطع تحصیلی"}
              value={
                user.educational_level
                  ? educationLevels?.data.find(
                      (level) => level.id === user.educational_level,
                    )?.name
                  : "---"
              }
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"رشته تحصیلی"}
              value={
                user.educational_field
                  ? educationFields?.data.find(
                      (field) => field.id === user.educational_field,
                    )?.name
                  : "---"
              }
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"کدپستی"}
              value={user.postal_code?.length ? user.postal_code : "---"}
              disabled
              className="bg-background-paper"
            />

            <Input
              label={"دانشکده"}
              value={
                user.department
                  ? departments?.data.find(
                      (department) => department.id === user.department,
                    )?.name
                  : "---"
              }
              disabled
              className="bg-background-paper"
            />
            <span className="col-span-2">
              <Input
                label={"آدرس"}
                value={user.address}
                disabled
                className="bg-background-paper"
              />
            </span>
            <Input
              label={"استاد یا دانشجوی دانشگاه صنعتی شریف"}
              value={user.is_sharif_student ? "بله" : "خیر"}
              disabled
              className="bg-background-paper"
            />
            {isCustomer && (
              <Input
                label={"مشتری همکار"}
                value={user.is_partner ? "بله" : "خیر"}
                disabled
                className="bg-background-paper"
              />
            )}
            <Input
              label={"نوع حساب"}
              value={"حقیقی"}
              disabled
              className="bg-background-paper"
            />
          </>
        ) : (
          <>
            <Input
              label={"کد ملی"}
              value={
                !!user?.linked_users_objs?.length
                  ? user?.linked_users_objs[0]?.national_id
                  : user.national_id
              }
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"شماره همراه"}
              value={
                !!user?.linked_users_objs?.length
                  ? user?.linked_users_objs[0]?.username
                    ? `0${user?.linked_users_objs[0]?.username.slice(3, user?.linked_users_objs[0].username.length)}` //business account from signup
                    : ""
                  : user?.username
                    ? `0${user?.username.slice(3, user?.username.length)}` //business account from customers management
                    : ""
              }
              disabled
              className="bg-background-paper"
            />
            <Input
              value={
                user.role_obj && user.role_obj.length > 0
                  ? user.role_obj.map((role: any) => role.name).join("، ")
                  : "---"
              }
              label={"سمت"}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"نام سازمان"}
              value={user.company_name}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"ایمیل سازمانی"}
              value={user.email}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"شناسه ملی سازمان"}
              value={user.company_national_id}
              disabled
              className="bg-background-paper"
            />

            <Input
              label={"شماره اقتصادی"}
              value={user.company_economic_number}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"تلفن"}
              value={user.company_telephone}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"کدپستی"}
              value={user.postal_code}
              disabled
              className="bg-background-paper"
            />
            <Input
              label={"آدرس"}
              value={user.address}
              disabled
              className="bg-background-paper"
            />
            {isCustomer && (
              <Input
                label={"مشتری همکار"}
                value={user.is_partner ? "بله" : "خیر"}
                disabled
                className="bg-background-paper"
              />
            )}
            <Input
              label={"نوع حساب"}
              value={"حقوقی"}
              disabled
              className="bg-background-paper"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewUserForm;
