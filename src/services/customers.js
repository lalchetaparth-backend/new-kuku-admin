import { createActionButton } from "../data/shared";
import { apiRequest } from "../lib/api";
import { getAdminToken } from "./auth";

const EMPTY_VALUE = "-";

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatBoolean(value) {
  if (value === true || value === 1 || value === "1") {
    return "Yes";
  }

  if (value === false || value === 0 || value === "0") {
    return "No";
  }

  return formatValue(value);
}

function formatDateTime(value) {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return formatValue(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(parsedDate);
}

function buildCustomerDetail(customer) {
  return {
    title: formatValue(customer.name) !== EMPTY_VALUE ? formatValue(customer.name) : "Customer Details",
    sections: [
      [
        ["Name", formatValue(customer.name)],
        ["Mobile No.", formatValue(customer.mobile)],
        ["Email", formatValue(customer.email)],
        ["GST No.", formatValue(customer.gst_number)],
        ["Verified", formatBoolean(customer.is_verified)],
      ],
      [
        ["Address", formatValue(customer.address)],
        ["City", formatValue(customer.city)],
        ["Pincode", formatValue(customer.pincode)],
        ["State", formatValue(customer.state)],
        ["UUID", formatValue(customer.uuid)],
        ["Created At", formatDateTime(customer.created_at)],
        ["Updated At", formatDateTime(customer.updated_at)],
      ],
    ],
  };
}

function mapCustomerToRow(customer, index) {
  return {
    id: index + 1,
    name: formatValue(customer.name),
    mobile: formatValue(customer.mobile),
    email: formatValue(customer.email),
    gst: formatValue(customer.gst_number),
    city: formatValue(customer.city),
    state: formatValue(customer.state),
    verified: formatBoolean(customer.is_verified),
    detailsButton: createActionButton("details", "bi bi-search"),
    details: buildCustomerDetail(customer),
    customerId: customer.id,
    uuid: customer.uuid,
  };
}

export async function getCustomerRows() {
  const token = getAdminToken();
  const response = await apiRequest("/admin/users", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const customers = Array.isArray(response?.data) ? response.data : [];

  return customers.map(mapCustomerToRow);
}