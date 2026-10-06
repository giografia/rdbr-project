import { parseLocalDate, displayToIsoDate } from "./date";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const fullNameRules = {
  required: "Name is required",
  minLength: { value: 3, message: "Name must be at least 3 characters" },
  maxLength: { value: 50, message: "Name must not exceed 50 characters" },
};

export function validateMobile(value) {
  const digits = value.replace(/\s/g, "");
  if (!digits) return "Mobile number is required";
  if (!/^\d+$/.test(digits))
    return "Please enter a valid Georgian mobile number (9 digits starting with 5)";
  if (digits[0] !== "5") return "Georgian mobile numbers must start with 5";
  if (digits.length !== 9) return "Mobile number must be exactly 9 digits";
  return true;
}
export function validateDateOfBirth(value) {
  if (!value) return "Date of birth is required";
  const iso = displayToIsoDate(value);
  if (!iso) return "Please enter a valid date of birth";
  const birth = parseLocalDate(value);
  const today = new Date();
  if (birth > today) return "Please enter a valid date of birth";

  const twelfthBirthday = new Date(
    birth.getFullYear() + 12,
    birth.getMonth(),
    birth.getDate(),
  );
  if (twelfthBirthday > today)
    return "You must be at least 12 years old to create an account";
  return true;
}
export function validateCardNumber(value) {
  const digits = value.replace(/\s/g, "");
  return /^\d{16}$/.test(digits) || "Card number must be 16 digits";
}
export function validateExpiry(value) {
  const match = value.trim().match(/^(\d{2})\/(\d{2})$/);
  if (!match) return "Use the MM/YY format";

  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return "Month must be between 01 and 12";

  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth() + 1;
  if (year < thisYear || (year === thisYear && month < thisMonth)) {
    return "This card has expired";
  }
  return true;
}
export function validateCvv(value) {
  return /^\d{3}$/.test(value.trim()) || "CVV must be 3 digits";
}
