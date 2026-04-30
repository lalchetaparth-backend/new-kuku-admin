import { exportToolbarGroup, liveHoldDropdown, productPreviewImage } from "./shared";
import { getProductRows } from "../services/products";

const emptyVariantFields = {
  weight: "",
  price: "",
  mrp: "",
  itemWeight: "",
  itemLength: "",
  itemWidth: "",
  itemHeight: "",
};

export function createProductVariant(index) {
  return {
    id: `variant-${index}`,
    ...emptyVariantFields,
  };
}

export const productsPageData = {
  title: "Products",
  documentTitle: "Products Page - Kuku Foods",
  toolbarGroups: [exportToolbarGroup, liveHoldDropdown],
  tabs: [
    { id: "products-list", label: "Product List" },
    { id: "add-product", label: "Add Product" },
  ],
  columns: [
    { key: "id", header: "#" },
    { key: "productName", header: "Product Name" },
    { key: "weight", header: "Weight (KG)" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price" },
    { key: "mrp", header: "MRP" },
    { key: "offerStatus", header: "Offer Status" },
    { key: "status", header: "Status" },
  ],
  rows: [],
  loadRows: getProductRows,
  emptyMessage: "No products found.",
  primaryFields: [
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
      name: "product_name",
      label: "Product Name",
      placeholder: "Product Name",
      colClass: "col-md-4",
      required: true,
    },
    {
      type: "select",
      name: "category_id",
      label: "Select Category",
      colClass: "col-md-2",
      defaultValue: "",
      placeholderOption: "Select Category",
      required: true,
      options: [],
    },
    {
      type: "select",
      name: "manage_inventory",
      label: "Manage Inventory",
      colClass: "col-md-2",
      required: true,
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      type: "text",
      name: "stock_in_pkts",
      label: "Stock in Pkts",
      placeholder: "Stock",
      colClass: "col-md-2",
      required: true,
    },
    {
      type: "text",
      name: "label_badge",
      label: "Lable Product badge",
      placeholder: "lable badge",
      colClass: "col-md-2",
    },
  ],
  variants: [createProductVariant(1), createProductVariant(2)],
  taxFields: [
    {
      type: "text",
      name: "hsn",
      label: "HSN Number.",
      placeholder: "HSNNo",
      colClass: "col-md-6",
      required: true,
    },
    {
      type: "text",
      name: "gst",
      label: "GST Number.",
      placeholder: "GSTNo",
      colClass: "col-md-6",
      required: true,
    },
  ],
  mainPhoto: {
    label: "Product Main Photo",
    previewSrc: productPreviewImage,
  },
  otherPhotos: {
    label: "Other Photos",
    previewImages: [productPreviewImage, productPreviewImage, productPreviewImage],
  },
};
