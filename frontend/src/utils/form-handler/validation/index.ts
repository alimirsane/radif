import * as yup from "yup";
import { errorMessages } from "@utils/form-handler/validation/messages";
import { validationUtils } from "@utils/form-handler/validation/utils";

export const validation = {
  nationalCode: yup
    .string()
    .test("validateNationalCode", errorMessages.nationalCode, (value) =>
      validationUtils.validateNationalCode(value),
    )
    .required(errorMessages.required),

  password: yup
    .string()
    .min(5, errorMessages.minLength(5))
    .required(errorMessages.required),

  email: yup
    .string()
    .email(errorMessages.email)
    .required(errorMessages.required)
    .test(errorMessages.email, errorMessages.email, (value) => {
      if (!value) return false;
      // This regex checks for at least one "." after "@" and at least one character after the "."
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }),

  sharifEmail: yup
    .string()
    .email(errorMessages.sharifEmail)
    .test(
      "is-sharif-email",
      errorMessages.sharifEmail,
      (value) =>
        value?.endsWith("sharif.edu") || value?.endsWith("sharif.ir") || !value,
    )
    .required(errorMessages.required),

  phone: yup
    .string()
    .test("validatePhone", errorMessages.phone, (value) =>
      validationUtils.validatePhone(value),
    )
    .required(errorMessages.required),

  optionalPhone: yup
    .string()
    .nullable()
    .test("validatePhone", errorMessages.phone, (value) => {
      if (!value) return true;
      return validationUtils.validatePhone(value);
    }),
  mobile: yup
    .string()
    .nullable()
    .test("validateMobile", errorMessages.mobile, (value) =>
      validationUtils.validateMobile(value),
    )
    .required(errorMessages.required),

  postalCode: yup
    .string()
    .test("validatePostalCode", errorMessages.postalCode, (value) =>
      validationUtils.validatePostalCode(value),
    )
    .required(errorMessages.required),

  optionalPostalCode: yup
    .string()
    .nullable()
    .test("validatePostalCode", errorMessages.postalCode, (value) => {
      if (!value) return true;
      return validationUtils.validatePostalCode(value);
    }),

  studentId: yup
    .string()
    .test("validateStudentId", errorMessages.studentId, (value) =>
      validationUtils.validateStudentId(value),
    )
    .required(errorMessages.required),

  trefCode: yup
    .string()
    .test("validateTrefCode", errorMessages.trefCode, (value) =>
      validationUtils.validateTrefCode(value),
    )
    .required(errorMessages.required),

  positiveIntegers: yup
    .string()
    .test("positiveIntegers", errorMessages.wrong, (value) =>
      validationUtils.validatePositiveIntegers(value),
    )
    .required(errorMessages.required),

  persianInput: yup
    .string()
    .test(
      "validatePersianCharacters",
      errorMessages.persianCharacters,
      (value) => validationUtils.validatePersianCharacters(value),
    )
    .required(errorMessages.required),
  englishInput: yup
    .string()
    .test(
      "validateEnglishCharacters",
      errorMessages.englishCharacters,
      (value) => validationUtils.validateEnglishCharacters(value),
    )
    .required(errorMessages.required),

  requiredInput: yup.string().required(errorMessages.required),
  requiredArrayInput: yup.array().required(errorMessages.required),
  checkboxInput: yup.boolean().oneOf([true], errorMessages.required),
};
