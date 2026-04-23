import {
  createActionButton,
  distributorDetail,
  exportToolbarGroup,
} from "./shared";

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
    rows: [detailRow],
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
    columns: detailColumns,
    rows: [detailRow],
  },
};
