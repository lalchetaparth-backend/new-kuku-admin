import {
  createIconLink,
  createStatusSwitch,
  exportToolbarGroup,
  filterDropdown,
  orderStatusDropdown,
} from "./shared";
import { getCorporateGiftingRows } from "../services/corporateGifting";
import { getCustomerInquiryRows } from "../services/customerInquiry";

export const simpleTablePages = {
  orders: {
    title: "Orders",
    documentTitle: "Orders - Kuku Foods",
    toolbarGroups: [exportToolbarGroup, orderStatusDropdown, filterDropdown],
    columns: [
      { key: "id", header: "#" },
      { key: "customer", header: "Customer" },
      { key: "contact", header: "Contact" },
      { key: "city", header: "City" },
      { key: "product", header: "Product" },
      { key: "qty", header: "Qty" },
      { key: "total", header: "Total" },
      { key: "status", header: "Order Status" },
      { key: "downloads", header: "Downloads" },
    ],
    rows: [
      {
        id: "1",
        customer: "Vishvesh Vasu",
        contact: "999 999 9999",
        city: "Jamnagar",
        product: "Dry Fruit Kachori (400gm)",
        qty: "3",
        total: "840/-",
        status: createStatusSwitch("pending", [
          { value: "pending", label: "Pending", badgeClass: "text-bg-warning" },
          { value: "success", label: "Success", badgeClass: "text-bg-success" },
          { value: "cancel", label: "Cancel", badgeClass: "text-bg-danger" },
        ]),
        downloads: createIconLink("bi bi-filetype-pdf"),
      },
      {
        id: "2",
        customer: "Vishvesh Vasu",
        contact: "999 999 9999",
        city: "Jamnagar",
        product: "Chapti Kachori (500gm)",
        qty: "1",
        total: "260/-",
        status: createStatusSwitch("success", [
          { value: "pending", label: "Pending", badgeClass: "text-bg-warning" },
          { value: "success", label: "Success", badgeClass: "text-bg-success" },
          { value: "cancel", label: "Cancel", badgeClass: "text-bg-danger" },
        ]),
        downloads: createIconLink("bi bi-filetype-pdf"),
      },
    ],
  },
  corporateGifts: {
    title: "Corporate Gifting Inquiries",
    documentTitle: "Corporate Gift Inquiries - Kuku Foods",
    toolbarGroups: [exportToolbarGroup],
    columns: [
      { key: "id", header: "#" },
      { key: "name", header: "Name" },
      { key: "companyName", header: "Company Name" },
      { key: "mobile", header: "Mobile No." },
      { key: "email", header: "Email" },
      { key: "location", header: "Location" },
      { key: "purpose", header: "Purpose of inquiry" },
    ],
    rows: [],
    loadRows: getCorporateGiftingRows,
    emptyMessage: "No corporate gifting inquiries found.",
  },
  inquiries: {
    title: "Inquiries",
    documentTitle: "Inquiries - Kuku Foods",
    toolbarGroups: [exportToolbarGroup],
    columns: [
      { key: "id", header: "#" },
      { key: "name", header: "Name" },
      { key: "mobile", header: "Mobile No." },
      { key: "email", header: "Email" },
      { key: "location", header: "Location" },
      { key: "message", header: "Message" },
    ],
    rows: [],
    loadRows: getCustomerInquiryRows,
    emptyMessage: "No inquiries found.",
  },
};
