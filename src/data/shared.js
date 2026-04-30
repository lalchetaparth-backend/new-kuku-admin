export const productPreviewImage =
  "/assets/products/dry-chapti-kachori/1 chapti kachori.jpg";

export const createStatusSwitch = (current, options, config = {}) => ({
  type: "statusSwitch",
  current,
  options,
  ...config,
});

export const createActionButton = (
  action,
  iconClass,
  buttonClass = "btn btn-sm btn-primary",
) => ({
  type: "action",
  action,
  iconClass,
  buttonClass,
});

export const createIconLink = (iconClass, href = "#") => ({
  type: "iconLink",
  iconClass,
  href,
});

export const exportToolbarGroup = {
  type: "buttons",
  className: "btn-group me-2",
  items: [
    {
      label: "Export PDF",
      iconClass: "bi bi-filetype-pdf me-1",
      buttonClass: "btn btn-sm btn-outline-secondary",
    },
    {
      label: "Export CSV",
      iconClass: "bi bi-file-spreadsheet me-1",
      buttonClass: "btn btn-sm btn-outline-secondary",
    },
  ],
};

export const orderStatusDropdown = {
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  items: [{ label: "Pending" }, { label: "Success" }, { label: "Cancel" }],
};

export const filterDropdown = {
  type: "dropdown",
  className: "btn-group",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-funnel me-1",
  label: "Select Filter",
  items: [
    { label: "Today" },
    { label: "This Week" },
    { label: "This Month" },
    { label: "This Year" },
  ],
};

export const liveHoldDropdown = {
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  items: [{ label: "On Hold" }, { label: "Live" }],
};

export const activeHoldDropdown = {
  type: "dropdown",
  className: "btn-group me-2",
  buttonClass: "btn btn-primary dropdown-toggle",
  iconClass: "bi bi-hourglass-split",
  label: "Select Status",
  items: [{ label: "Active" }, { label: "Hold" }],
};

export const distributorDetail = {
  title: "ABC Enterprise",
  sections: [
    [
      ["Distributor Name", "Person name"],
      ["Business Name", "ABC Enterprise"],
      ["GST No.", "24ABCDE1234F1ZC"],
      ["Mobile No.", "999 999 9999"],
      ["Email", "mail@yourmail.com"],
      ["Address", "Address Line 1, Address Line 2,"],
      ["City", "Jamnagar"],
      ["Pincode", "361001"],
      ["State", "Gujarat"],
      ["Country", "India"],
    ],
    [
      ["Annual Revenue", "Rs.6,00,000"],
      ["Existing No. of Salesmen", "50"],
      ["Investment Potential", "Rs.2,00,000"],
      ["Ref. By", "Vasu Brothers"],
      [
        "Why You Interested?",
        "Interested for what they reason of fact is here shown written by inquiry sender",
      ],
    ],
  ],
};

export const navSections = [
  {
    items: [
      {
        path: "/dashboard",
        labelLines: ["Dashboard"],
        symbol: "house-fill",
      },
      {
        path: "/orders",
        labelLines: ["Orders (20)"],
        symbol: "file-earmark",
        showDot: true,
      },
      {
        path: "/categories",
        labelLines: ["Category"],
        symbol: "cart",
      },
      {
        path: "/products",
        labelLines: ["Products"],
        symbol: "cart",
      },
      {
        path: "/blogs",
        labelLines: ["Blogs"],
        iconClass: "bi bi-pencil-square",
      },
      {
        path: "/distributors",
        labelLines: ["Distributor", "Inquiries (20)"],
        iconClass: "bi bi-shop",
        showDot: true,
      },
      {
        path: "/offers",
        labelLines: ["Offer (20)"],
        iconClass: "bi bi-shop",
        showDot: true,
      },
      {
        path: "/billings",
        labelLines: ["Billings"],
        iconClass: "bi bi-receipt-cutoff",
      },
      {
        path: "/modals",
        labelLines: ["Modal Box", "(Pop-up Home page)"],
        iconClass: "bi bi-window-stack",
      },
    ],
  },
  {
    heading: "Reports & Data",
    items: [
      {
        path: "/reports",
        labelLines: ["Reports"],
        symbol: "graph-up",
      },
      {
        path: "/customers",
        labelLines: ["Customers (20)"],
        symbol: "people",
        showDot: true,
      },
      {
        path: "/corporate-gifts",
        labelLines: ["Coporate Gift", "Inquiries (20)"],
        iconClass: "bi bi-gift",
        showDot: true,
      },
      {
        path: "/inquiries",
        labelLines: ["Inquiries (20)"],
        symbol: "puzzle",
        showDot: true,
      },
    ],
  },
];
