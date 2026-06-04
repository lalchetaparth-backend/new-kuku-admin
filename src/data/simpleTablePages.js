import {
  exportToolbarGroup,
  filterDropdown,
  orderStatusDropdown,
} from "./shared";
import { getCorporateGiftingRows } from "../services/corporateGifting";
import { getCustomerInquiryRows } from "../services/customerInquiry";
import { getOrderRows } from "../services/orders";

export const simpleTablePages = {
  orders: {
    title: "Orders",
    documentTitle: "Orders - Kuku Foods",
    toolbarGroups: [exportToolbarGroup, orderStatusDropdown, filterDropdown],
    columns: [
      { key: "id", header: "#" },
      { key: "orderNumber", header: "Order ID", width: "8rem" },
      { key: "customer", header: "Customer", minWidth: "8rem" },
      { key: "contact", header: "Contact", width: "7.5rem" },
      { key: "email", header: "Email", minWidth: "10rem" },
      { key: "city", header: "City", width: "7.5rem" },
      { key: "product", header: "Product", minWidth: "18rem", grow: 2 },
      { key: "qty", header: "Qty", width: "4.5rem", center: true },
      { key: "total", header: "Total", width: "6rem" },
      { key: "paymentStatus", header: "Payment", width: "7rem" },
      { key: "status", header: "Order Status", width: "9rem" },
      { key: "downloads", header: "Downloads", width: "6.5rem", center: true },
    ],
    rows: [],
    loadRows: getOrderRows,
    emptyMessage: "No orders found.",
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
