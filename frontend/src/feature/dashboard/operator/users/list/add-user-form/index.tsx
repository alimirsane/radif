import * as yup from "yup";
import React from "react";
import { useMemo } from "react";

import { Card } from "@kit/card";
import { Input } from "@kit/input";
import { Button } from "@kit/button";
import { Select } from "@kit/select";
import { SvgIcon } from "@kit/svg-icon";
import { IcCheck, IcChevronDown } from "@feature/kits/common/icons";
import { FormHandler } from "@utils/form-handler";
import { validation } from "@utils/form-handler/validation";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { apiUser } from "@api/service/user";
import { apiRole } from "@api/service/role";
import { apiAccessLevel } from "@api/service/access-level";
import { CreateUserType } from "@api/service/user/type/current-user";
import { useReloadUsers } from "../get-info-user";
import { useModalHandler } from "@utils/modal-handler/config";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { useRouter } from "next/router";
import { PersonalUser } from "./personal";

const AddUserForm = () => {
  const { mutateAsync } = useMutation(
    apiUser(true, {
      success: "ثبت همکار با موفقیت انجام شد",
      fail: "ثبت همکار انجام نشد",
      waiting: "درحال انتظار",
    }).create(),
  );
  const { data: roles } = useQuery(apiRole().getAll());
  const { data: accessLevels } = useQuery(apiAccessLevel().getAll());
  const { setReloadUsers } = useReloadUsers();
  const hideModal = useModalHandler((state) => state.hideModal);

  const initialValues = useMemo(() => {
    return {
      first_name: "",
      last_name: "",
      role: [],
      access_level: [],
      national_id: "",
      password: "",
    };
  }, []);
  const userAddValidation = useMemo(() => {
    return yup.object({
      first_name: validation.persianInput,
      last_name: validation.persianInput,
      role: validation.requiredArrayInput,
      access_level: validation.requiredArrayInput,
      username: validation.mobile,
      national_id: validation.nationalCode,
      password: validation.requiredInput,
    });
  }, []);

  const positionOptions = useMemo(() => {
    let roleData = roles?.data.map((role) => {
      return {
        anotherCustomName: role.name,
        value: role.id.toString(),
      };
    });
    return roleData?.length
      ? roleData
      : [
          {
            anotherCustomName: "اپراتور آزمایشگاه",
            value: "1",
          },
          {
            anotherCustomName: "پذیرش",
            value: "2",
          },
        ];
  }, [roles?.data]);

  const accessOptions = useMemo(() => {
    let accsessLevelData = accessLevels?.data.map((level) => {
      return {
        anotherCustomName: level.name,
        value: level.id.toString(),
      };
    });

    return accsessLevelData?.length
      ? accsessLevelData
      : [
          {
            anotherCustomName: "ثبت نوبت و دریافت هزینه",
            value: "1",
          },
          {
            anotherCustomName: "مدیریت کارمندان",
            value: "2",
          },
        ];
  }, [accessLevels?.data]);

  const submit = (values: CreateUserType) => {
    let data = {
      first_name: values.first_name,
      last_name: values.last_name,
      role: values.role,
      access_level: values.access_level,
      username: `+98${values.username?.slice(1, 11)}`,
      national_id: values.national_id,
      user_type: "staff",
      password: values.password,
    };
    mutateAsync(data)
      .then((res) => {
        setReloadUsers(true);
        setTimeout(() => {
          hideModal();
        }, 1000);
      })
      .catch((err) => {});
  };

  const resetAndClose = () => {
    setReloadUsers(true);
    setTimeout(() => {
      hideModal();
    }, 1000);
  };
  return <PersonalUser closeModal={resetAndClose} />;
};

export default AddUserForm;
