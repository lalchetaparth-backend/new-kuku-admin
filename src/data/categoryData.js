import { activeHoldDropdown, createStatusSwitch, exportToolbarGroup } from "./shared";

const categoryStatusOptions = [
  { value: "active", label: "Active", badgeClass: "text-bg-success" },
  { value: "hold", label: "Hold", badgeClass: "text-bg-warning" },
];

export const categoryPageData = {
  title: "Product Category",
  documentTitle: "Category Page - Kuku Foods",
  toolbarGroups: [exportToolbarGroup, activeHoldDropdown],
  imageSrc: "/assets/images/kuku-namkeen-logo.png",
  rows: [
    {
      id: "1",
      imageAlt: "Kuku Namkeen",
      category: "Kachori",
      products: [
        "Chapti Kachori",
        "Round Kachori",
        "Dry Fruit Kachori",
        "Rajbhog Kachori",
      ],
      status: createStatusSwitch("active", categoryStatusOptions),
    },
    {
      id: "2",
      imageAlt: "Kuku Namkeen",
      category: "Sweets",
      products: [
        "Gulab Paak",
        "Kaju Katli",
        "Khajur Paak",
        "Adadiya",
        "Anjir Paak",
      ],
      status: createStatusSwitch("active", categoryStatusOptions),
    },
    {
      id: "3",
      imageAlt: "Kuku Namkeen",
      category: "Combo",
      products: [
        "K01-Holi Special (Chapti Kachori - Round Kachori)",
        "K02-Ramnavmi Special (Kaju katli - Round Kachori)",
        "K03-Diwali Special (Sweet Bliss Mini Box - Round Kachori)",
      ],
      status: createStatusSwitch("active", categoryStatusOptions),
    },
  ],
};
