import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function mapCustomerInquiryToRow(inquiry, index) {
  return {
    id: index + 1,
    name: formatValue(inquiry.name),
    mobile: formatValue(inquiry.phone),
    email: formatValue(inquiry.email),
    location: formatValue(inquiry.location),
    message: formatValue(inquiry.message),
    uuid: inquiry.uuid,
  };
}

export async function getCustomerInquiryRows() {
  const response = await apiRequest("/web/customerInquiry");
  const inquiries = Array.isArray(response?.data) ? response.data : [];

  return inquiries.map(mapCustomerInquiryToRow);
}
