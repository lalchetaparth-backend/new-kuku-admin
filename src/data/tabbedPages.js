import {
  createStatusSwitch,
  exportToolbarGroup,
  productPreviewImage,
} from "./shared";
import { addBlog, getBlogRows, updateBlogStatus } from "../services/blogs";

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
          { key: "id", header: "#" },
          { key: "name", header: "Blogs Name" },
          { key: "date", header: "Date" },
          { key: "subject", header: "Subject" },
          { key: "status", header: "Status" },
        ],
        rows: [
          {
            id: "1",
            name: "Blogs Name",
            date: "24 March 2026",
            subject: "Subject of blogs",
            status: createStatusSwitch("live", [
              { value: "live", label: "Live", badgeClass: "text-bg-success" },
              { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
            ]),
          },
          {
            id: "2",
            name: "Blogs Name",
            date: "24 March 2026",
            subject: "Subject of blogs",
            status: createStatusSwitch("hold", [
              { value: "live", label: "Live", badgeClass: "text-bg-success" },
              { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
            ]),
          },
        ],
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
            label: "Blogs Title",
            placeholder: "Product Name",
            colClass: "col-md-6",
          },
          {
            type: "text",
            name: "modalSubject",
            label: "Blogs Subject",
            placeholder: "Product Name",
            colClass: "col-md-6",
          },
          {
            type: "textarea",
            name: "modalContent",
            label: "Blogs Content",
            placeholder: "Leave a comment here",
            colClass: "col-md-12",
            height: 100,
          },
          {
            type: "file",
            name: "modalImage",
            label: "Blogs Title Image",
            colClass: "col-md-4",
            previewSrc: productPreviewImage,
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
        rows: [
          {
            id: "1",
            productName: "Dry Fruit Kachori (400gm)",
            dateRange: "24 March 2026 - 05 April 2026",
            offer: "10%",
            status: createStatusSwitch("active", [
              { value: "active", label: "Active", badgeClass: "text-bg-success" },
              { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
            ]),
          },
          {
            id: "2",
            productName: "Chapti Fruit Kachori (400gm)",
            dateRange: "24 March 2026 - 05 April 2026",
            offer: "10%",
            status: createStatusSwitch("hold", [
              { value: "active", label: "Active", badgeClass: "text-bg-success" },
              { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
            ]),
          },
        ],
      },
      {
        id: "add-offer",
        label: "Add Offer",
        formFields: [
          {
            type: "select",
            name: "product",
            label: "Works with selects",
            placeholderOption: "Product Name",
            colClass: "col-md-4",
            options: [
              { value: "dry-fruit-kachori", label: "Dry Fruit Kachori (400gm)" },
              { value: "chapti-kachori", label: "Chapti Kachori (400gm)" },
              { value: "rajbhog-kachori", label: "Rajbhog Kachori (400gm)" },
            ],
          },
          {
            type: "text",
            name: "offerValue",
            label: "eg; 5%",
            placeholder: "Offer",
            colClass: "col-md-2",
          },
          {
            type: "date",
            name: "offerStart",
            label: "Offer Starts From",
            placeholder: "Offer",
            colClass: "col-md-3",
          },
          {
            type: "date",
            name: "offerEnd",
            label: "Offer End to",
            placeholder: "Offer",
            colClass: "col-md-3",
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
