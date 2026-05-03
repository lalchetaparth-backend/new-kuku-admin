import {
  createStatusSwitch,
  exportToolbarGroup,
  productPreviewImage,
} from "./shared";
import { addBlog, getBlogRows, updateBlogStatus } from "../services/blogs";
import { getModalRows } from "../services/modals";
import { addOffer, getOfferRows } from "../services/offers";
import { getProductOptions } from "../services/products";

const blogStatusDropdown = {
  id: "blogStatus",
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  defaultValue: "all",
  items: [
    { label: "All Status", value: "all" },
    { label: "On Hold", value: "inactive" },
    { label: "Active", value: "active" },
  ],
};

function filterBlogRows(rows, filters) {
  const selectedStatus = filters.blogStatus ?? "all";

  if (selectedStatus === "all") {
    return rows;
  }

  return rows.filter((row) => row.status?.current === selectedStatus);
}

export const tabbedPages = {
  blogs: {
    title: "Blogs",
    documentTitle: "Blogs Page - Kuku Foods",
    toolbarGroups: [exportToolbarGroup, blogStatusDropdown],
    tabs: [
      {
        id: "blogs-list",
        label: "Blogs List",
        columns: [
          { key: "id", header: "#" },
          { key: "name", header: "Blogs Name" },
          { key: "date", header: "Date" },
          { key: "subject", header: "Subject" },
          { key: "status", header: "Status" },
        ],
        rows: [],
        loadRows: getBlogRows,
        updateStatus: updateBlogStatus,
        activeStatusValue: "active",
        inactiveStatusValue: "inactive",
        filterRows: filterBlogRows,
        emptyMessage: "No blogs found.",
      },
      {
        id: "add-blogs",
        label: "Add Blogs",
        submitForm: addBlog,
        refreshTabsOnSuccess: ["blogs-list"],
        formFields: [
          {
            type: "text",
            name: "meta_title",
            label: "Meta Title",
            placeholder: "Meta Title",
            colClass: "col-md-4",
            required: true,
          },
          {
            type: "text",
            name: "meta_keywords",
            label: "Meta Keywords",
            placeholder: "Meta Keywords",
            colClass: "col-md-4",
            required: true,
          },
          {
            type: "text",
            name: "meta_description",
            label: "Meta description",
            placeholder: "Meta description",
            colClass: "col-md-4",
            required: true,
          },
          {
            type: "text",
            name: "description",
            label: "Blog Title",
            placeholder: "Blog Title",
            colClass: "col-md-4",
            required: true,
          },
          {
            type: "text",
            name: "blog_subject",
            label: "Blog Subject",
            placeholder: "Blog Subject",
            colClass: "col-md-4",
            required: true,
          },
          {
            type: "select",
            name: "status",
            label: "Status",
            colClass: "col-md-4",
            defaultValue: "Active",
            options: [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "On Hold" },
            ],
          },
          {
            type: "textarea",
            name: "blog_content",
            label: "Blog Content",
            placeholder: "Leave a comment here",
            colClass: "col-md-12",
            height: 100,
            required: true,
          },
          {
            type: "file",
            name: "file",
            label: "Blog Title Image",
            colClass: "col-md-4",
            accept: "image/*",
            required: true,
          },
          {
            type: "submit",
            label: "Submit Blog",
            inputClassName: "btn btn-primary",
            colClass: "col-md-12",
          },
        ],
      },
    ],
  },
  modals: {
    title: "Modal Box (Pop-up Home Page)",
    documentTitle: "Modal Box - Kuku Foods",
    toolbarGroups: [],
    tabs: [
      {
        id: "modal-list",
        label: "Modal List",
        columns: [
          { key: "image", header: "Image", width: "7rem", minWidth: "7rem", grow: 0 },
          { key: "title", header: "Modal Title", minWidth: "14rem" },
          { key: "date", header: "Date" },
          { key: "description", header: "Modal Description", grow: 2 },
          { key: "status", header: "Status" },
        ],
        rows: [],
        loadRows: getModalRows,
        emptyMessage: "No modals found.",
      },
      {
        id: "add-modal",
        label: "Add Modal",
        formFields: [
          {
            type: "text",
            name: "metaTitle",
            label: "Meta Title",
            placeholder: "Meta Title",
            colClass: "col-md-4",
          },
          {
            type: "text",
            name: "metaKeywords",
            label: "Meta Keywords",
            placeholder: "Meta Keywords",
            colClass: "col-md-4",
          },
          {
            type: "text",
            name: "metaDescription",
            label: "Meta description",
            placeholder: "Meta description",
            colClass: "col-md-4",
          },
          {
            type: "text",
            name: "modalTitle",
            label: "Modal Title",
            placeholder: "Modal Title",
            colClass: "col-md-12",
          },
          {
            type: "textarea",
            name: "modalContent",
            label: "Modal Description",
            placeholder: "Modal Description",
            colClass: "col-md-12",
            height: 100,
          },
          {
            type: "file",
            name: "modalImage",
            label: "Modal Image",
            colClass: "col-md-4",
            previewSrc: productPreviewImage,
          },
          {
            type: "submit",
            label: "Submit Modal",
            inputClassName: "btn btn-primary",
            colClass: "col-md-12",
          },
        ],
      },
    ],
  },
  offers: {
    title: "Offer",
    documentTitle: "Offer - Kuku Foods",
    toolbarGroups: [],
    tabs: [
      {
        id: "offer-list",
        label: "Offer List",
        columns: [
          { key: "id", header: "#" },
          { key: "productName", header: "Product Name" },
          { key: "dateRange", header: "Date (from - to)" },
          { key: "offer", header: "Offer" },
          { key: "status", header: "Status" },
        ],
        rows: [],
        loadRows: getOfferRows,
        emptyMessage: "No offers found.",
      },
      {
        id: "add-offer",
        label: "Add Offer",
        submitForm: addOffer,
        refreshTabsOnSuccess: ["offer-list"],
        redirectTabOnSuccess: "offer-list",
        formFields: [
          {
            type: "select",
            name: "product_id",
            label: "Product Name",
            placeholderOption: "Product Name",
            colClass: "col-md-4",
            loadingPlaceholderOption: "Loading products...",
            disableWhenEmptyOptions: true,
            options: [],
            loadOptions: getProductOptions,
            required: true,
          },
          {
            type: "text",
            name: "offer_percentage",
            label: "eg; 5%",
            placeholder: "Offer",
            colClass: "col-md-2",
            required: true,
          },
          {
            type: "text",
            name: "coupon_code",
            label: "Coupen Code",
            placeholder: "Coupen Code",
            colClass: "col-md-2",
            transform: "uppercaseAlphaNumeric",
            pattern: "[A-Z0-9]+",
            title: "Use uppercase letters A-Z and numbers 0-9 only.",
            inputMode: "text",
            autoComplete: "off",
            maxLength: 20,
            inputStyle: { textTransform: "uppercase" },
            required: true,
          },
          {
            type: "date",
            name: "startdate",
            label: "Offer Starts From",
            placeholder: "Offer",
            colClass: "col-md-2",
            required: true,
          },
          {
            type: "date",
            name: "enddate",
            label: "Offer End to",
            placeholder: "Offer",
            colClass: "col-md-2",
            required: true,
          },
          {
            type: "submit",
            label: "Apply Offer",
            inputClassName: "btn btn-primary",
            colClass: "col-md-12",
          },
        ],
      },
    ],
  },
};
