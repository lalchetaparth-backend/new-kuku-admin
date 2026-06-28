import {
  createActionButton,
  distributorDetail,
  exportToolbarGroup,
} from "./shared";
import { getCustomerRows } from "../services/customers";
import { getDistributorInquiryRows } from "../services/distributorInquiry";

const detailColumns = [
  { key: "id", header: "#" },
  { key: "distributorName", header: "Distributor Name" },
  { key: "businessName", header: "Business Name" },
  { key: "gst", header: "GST No." },
  { key: "mobile", header: "Mobile No." },
  { key: "email", header: "Email" },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "detailsButton", header: "More Details" },
];

const customerColumns = [
  { key: "id", header: "#" },
  { key: "name", header: "Customer Name" },
  { key: "mobile", header: "Mobile No." },
  { key: "email", header: "Email" },
  { key: "gst", header: "GST No." },
  { key: "city", header: "City" },
  { key: "state", header: "State" },
  { key: "verified", header: "Verified" },
  { key: "detailsButton", header: "More Details" },
];

const detailRow = {
  id: "1",
  distributorName: "Person name",
  businessName: "ABC Enterprise",
  gst: "24ABCDE1234F1ZC",
  mobile: "999 999 9999",
  email: "mail@yourmail.com",
  city: "Jamnagar",
  state: "Gujarat",
  detailsButton: createActionButton("details", "bi bi-search"),
  details: distributorDetail,
};

export const detailPages = {
  distributors: {
    title: "Distributor Inquiries",
    documentTitle: "Distributor inquiry - Kuku Foods",
    toolbarGroups: [exportToolbarGroup],
    columns: detailColumns,
    rows: [],
    loadRows: getDistributorInquiryRows,
    emptyMessage: "No distributor inquiries found.",
  },
  billings: {
    title: "Billings",
    documentTitle: "Billings - Kuku Foods",
    toolbarGroups: [exportToolbarGroup],
    columns: detailColumns,
    rows: [detailRow],
  },
  customers: {
    title: "Customers",
    documentTitle: "Customers - Kuku Foods",
    toolbarGroups: [exportToolbarGroup],
    columns: customerColumns,
    rows: [],
    loadRows: getCustomerRows,
    emptyMessage: "No customers found.",
  },
};