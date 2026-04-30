import { createActionButton } from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
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

function buildDistributorDetail(inquiry) {
  const titleParts = [inquiry.business_name, inquiry.first_name]
    .map((value) => formatValue(value))
    .filter((value) => value !== EMPTY_VALUE);

  return {
    title: titleParts.join(" - ") || "Distributor Inquiry",
    sections: [
      [
        ["Distributor Name", formatValue(inquiry.first_name)],
        ["Business Name", formatValue(inquiry.business_name)],
        ["GST No.", formatValue(inquiry.gst_no)],
        ["Mobile No.", formatValue(inquiry.contact)],
        ["Email", formatValue(inquiry.email)],
        ["Address", formatValue(inquiry.address)],
        ["City", formatValue(inquiry.city)],
        ["Pincode", formatValue(inquiry.pincode)],
        ["State", formatValue(inquiry.state)],
        ["Country", formatValue(inquiry.country)],
      ],
      [
        ["Nature of Business", formatValue(inquiry.nature_of_business)],
        ["Experience", formatValue(inquiry.experience)],
        ["Annual Revenue", formatValue(inquiry.annual_revenue)],
        ["Existing No. of Salesmen", formatValue(inquiry.ext_salesmen)],
        ["Investment Potential", formatValue(inquiry.invest_potential)],
        ["Ref. By", formatValue(inquiry.reference_by)],
        ["Why You Interested?", formatValue(inquiry.why_interested)],
        ["Created At", formatDateTime(inquiry.created_at)],
        ["Updated At", formatDateTime(inquiry.updated_at)],
      ],
    ],
  };
}

function mapDistributorInquiryToRow(inquiry, index) {
  return {
    id: index + 1,
    distributorName: formatValue(inquiry.first_name),
    businessName: formatValue(inquiry.business_name),
    gst: formatValue(inquiry.gst_no),
    mobile: formatValue(inquiry.contact),
    email: formatValue(inquiry.email),
    city: formatValue(inquiry.city),
    state: formatValue(inquiry.state),
    detailsButton: createActionButton("details", "bi bi-search"),
    details: buildDistributorDetail(inquiry),
    uuid: inquiry.uuid,
  };
}

export async function getDistributorInquiryRows() {
  const response = await apiRequest("/web/distributorInquiry");
  const inquiries = Array.isArray(response?.data) ? response.data : [];

  return inquiries.map(mapDistributorInquiryToRow);
}
