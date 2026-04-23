import { activeHoldDropdown, createStatusSwitch, exportToolbarGroup } from "./shared";

export const categoryPageData = {
  title: "Product Category",
  documentTitle: "Category Page - Kuku Foods",
  toolbarGroups: [exportToolbarGroup, activeHoldDropdown],
  formFields: [
    {
      type: "text",
      name: "categoryName",
      label: "Category name",
      placeholder: "Category name",
      colClass: "col-md-4",
    },
    {
      type: "submit",
      label: "Add Category",
      inputClassName: "btn btn-dark",
      colClass: "col-md-3",
    },
  ],
  columns: [
    { key: "id", header: "#" },
    { key: "category", header: "Category" },
    { key: "products", header: "Product (4)" },
    { key: "status", header: "Status" },
  ],
  rows: [
    {
      id: "1",
      category: "Kachori",
      products: [
        "Chapti Kachori",
        "Round Kachori",
        "Dry Fruit Kachori",
        "Rajbhog Kachori",
      ],
      status: createStatusSwitch("active", [
        { value: "active", label: "Active", badgeClass: "text-bg-success" },
        { value: "hold", label: "Hold", badgeClass: "text-bg-warning" },
      ]),
    },
    {
      id: "2",
      category: "Sweets",
      products: [
        "Gulab Paak",
        "Kaju Katli",
        "Khajur Paak",
        "Adadiya",
        "Anjir Paak",
      ],
      status: createStatusSwitch("active", [
        { value: "active", label: "Active", badgeClass: "text-bg-success" },
        { value: "hold", label: "Hold", badgeClass: "text-bg-warning" },
      ]),
    },
    {
      id: "3",
      category: "Combo",
      products: [
        "K01-Holi Special (Chapti Kachori - Round Kachori)",
        "K02-Ramnavmi Special (Kaju katli - Round Kachori)",
        "K03-Diwali Special (Sweet Bliss Mini Box - Round Kachori)",
      ],
      status: createStatusSwitch("hold", [
        { value: "active", label: "Active", badgeClass: "text-bg-success" },
        { value: "hold", label: "Hold", badgeClass: "text-bg-warning" },
      ]),
    },
  ],
};
