import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const WORK_WITH_LABELS = {
  1: "Employee Gifting",
  2: "Personal Gifting",
  3: "Pantry Snacking",
  4: "Festive Gifting",
  5: "Wholesale Retail",
  6: "Corporate Gifting",
};
const WORK_WITH_CONSTANT_LABELS = {
  WORK_WITH_EMPLOYEE_GIFTING: "Employee Gifting",
  WORK_WITH_PERSONAL_GIFTING: "Personal Gifting",
  WORK_WITH_PANTRY_SNACKING: "Pantry Snacking",
  WORK_WITH_FESTIVE_GIFTING: "Festive Gifting",
  WORK_WITH_WHOLESALE_RETAIL: "Wholesale Retail",
  WORK_WITH_CORPORATE_GIFTING: "Corporate Gifting",
};

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatWorkWith(value) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const numericValue = Number(value);

  if (WORK_WITH_LABELS[numericValue]) {
    return WORK_WITH_LABELS[numericValue];
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) {
    return EMPTY_VALUE;
  }

  if (WORK_WITH_CONSTANT_LABELS[normalizedValue]) {
    return WORK_WITH_CONSTANT_LABELS[normalizedValue];
  }

  if (normalizedValue.startsWith("WORK_WITH_")) {
    return normalizedValue
      .replace("WORK_WITH_", "")
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return formatValue(value);
}

function mapCorporateGiftingToRow(inquiry, index) {
  return {
    id: index + 1,
    name: formatValue(inquiry.name),
    companyName: formatValue(inquiry.company ?? inquiry.company_name),
    mobile: formatValue(inquiry.mobile ?? inquiry.phone ?? inquiry.contact),
    email: formatValue(inquiry.email),
    location: formatValue(inquiry.location),
    purpose: formatWorkWith(inquiry.work_with ?? inquiry.purpose),
    uuid: inquiry.uuid,
  };
}

export async function getCorporateGiftingRows() {
  const response = await apiRequest("/corporate-gifting/getCorporateGiftings");
  const inquiries = Array.isArray(response?.data) ? response.data : [];

  return inquiries.map(mapCorporateGiftingToRow);
}
