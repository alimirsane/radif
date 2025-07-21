export const validationUtils = {
  validateNationalCode: (value: string | undefined | null) => {
    if (value == undefined) return true;
    let sum = 0;
    let temp = 0;
    let checkDigit = parseInt(value.charAt(9));
    for (let i = 0; i < 9; i++) {
      temp = parseInt(value.charAt(i));
      sum += temp * (10 - i);
    }
    sum %= 11;
    if (sum < 2 && checkDigit == sum) {
      return true;
    }
    return sum >= 2 && checkDigit == 11 - sum;
  },

  validatePostalCode: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!value.match(/\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b/);
  },

  validateMobile: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!value.match(/^09\d{9}$/);
  },

  validatePhone: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!value.match(
      /^0(?:41|44|45|31|26|84|77|21|38|56|51|58|61|24|23|54|71|28|25|87|34|83|74|17|13|66|11|86|76|81|35)\d{8}$/,
    );
  },

  validateStudentId: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!(value && value.match(/^\d{6}$/));
  },

  validateTrefCode: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!(value && value.match(/^[1-9]\d{0,15}$/));
  },

  validatePositiveIntegers: (value: string | undefined | null) => {
    if (value == undefined) return true;

    return !!(value && value.match(/^[1-9]\d*$/));
  },

  validatePersianCharacters: (value: string | undefined | null): boolean => {
    if (value == undefined) return true;

    return !!(value && /^[\u0600-\u06FF\d\s.#@$%^&*()-]+$/.test(value));
  },

  validateEnglishCharacters: (value: string | undefined | null): boolean => {
    if (value == undefined) return true;

    return /^[a-zA-Z\d\s.#@$%^&*()/-]+$/g.test(value);
  },
};
