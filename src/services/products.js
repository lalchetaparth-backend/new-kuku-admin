import { createStatusSwitch } from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const productStatusOptions = [
  { value: "live", label: "Live", badgeClass: "text-bg-success" },
  { value: "hold", label: "On Hold", badgeClass: "status-badge-inactive" },
];

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();
  const numericValue = Number(normalizedValue);

  if (Number.isNaN(numericValue)) {
    return formatValue(value);
  }

  const formattedValue = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: normalizedValue.includes(".") ? 0 : 0,
    maximumFractionDigits: 2,
  }).format(numericValue);

  return `${formattedValue.replace(/\.00$/, "")}/-`;
}

function normalizeProductStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "live" || normalizedStatus === "yes") {
    return "live";
  }

  return "hold";
}

function normalizeOfferStatus(product) {
  const normalizedStatus = String(product.is_featured ?? "")
    .trim()
    .toLowerCase();

  if (normalizedStatus === "yes" || normalizedStatus === "active" || normalizedStatus === "live") {
    return "live";
  }

  return "hold";
}

function isLiveProduct(product) {
  return normalizeProductStatus(product?.product_status) === "live";
}

function normalizeSubmitStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (normalizedStatus === "active" || normalizedStatus === "live") {
    return "Active";
  }

  return "Inactive";
}

function buildVariantData(formData) {
  const variantsByIndex = new Map();

  for (const [key, rawValue] of formData.entries()) {
    const matchedField = key.match(
      /^variants\[(\d+)\]\.(weight|price|mrp|itemWeight|itemLength|itemWidth|itemHeight)$/,
    );

    if (!matchedField) {
      continue;
    }

    const [, rawIndex, fieldName] = matchedField;
    const index = Number(rawIndex);
    const value = String(rawValue ?? "").trim();
    const currentVariant = variantsByIndex.get(index) ?? {};

    currentVariant[fieldName] = value;
    variantsByIndex.set(index, currentVariant);
  }

  return Array.from(variantsByIndex.entries())
    .sort(([leftIndex], [rightIndex]) => leftIndex - rightIndex)
    .map(([, variant]) => ({
      weight: variant.weight ?? "",
      product_price: variant.price ?? "",
      product_sell_price: variant.mrp ?? "",
      item_weight: variant.itemWeight ?? "",
      item_length: variant.itemLength ?? "",
      item_width: variant.itemWidth ?? "",
      item_height: variant.itemHeight ?? "",
    }))
    .filter((variant) =>
      Object.values(variant).some((value) => String(value).trim() !== ""),
    );
}

function isActiveCategory(category) {
  const normalizedStatus = String(category?.category_status ?? "")
    .trim()
    .toLowerCase();

  return normalizedStatus === "active" || normalizedStatus === "live";
}

function formatCategory(product) {
  if (product.product_type) {
    return formatValue(product.product_type);
  }

  if (product.category_name) {
    return formatValue(product.category_name);
  }

  if (product.category?.name) {
    return formatValue(product.category.name);
  }

  if (product.category_id !== null && product.category_id !== undefined) {
    return String(product.category_id);
  }

  return EMPTY_VALUE;
}

function formatWeight(product) {
  if (product.weight) {
    return formatValue(product.weight);
  }

  if (Array.isArray(product.variant_data) && product.variant_data[0]?.weight) {
    return formatValue(product.variant_data[0].weight);
  }

  return EMPTY_VALUE;
}

function mapProductToRow(product, index) {
  return {
    id: index + 1,
    productName: formatValue(product.product_name),
    weight: formatWeight(product),
    category: formatCategory(product),
    price: formatPrice(product.product_price),
    mrp: formatPrice(product.product_sell_price),
    offerStatus: createStatusSwitch(
      normalizeOfferStatus(product),
      productStatusOptions,
    ),
    status: createStatusSwitch(
      normalizeProductStatus(product.product_status),
      productStatusOptions,
      {
        activeValue: "live",
        interactive: true,
        showCurrentOnly: true,
      },
    ),
    productId: product.product_id,
    thumbnailImage: product.thumbnail_image,
    variants: Array.isArray(product.variant_data) ? product.variant_data : [],
  };
}

export async function getProductRows() {
  const response = await apiRequest("/product/getProducts");
  const products = Array.isArray(response?.data) ? response.data : [];

  return products.map(mapProductToRow);
}

export async function getProductOptions() {
  const response = await apiRequest("/product/getProducts");
  const products = Array.isArray(response?.data) ? response.data : [];
  const liveProducts = products.filter(isLiveProduct);
  const productsToUse = liveProducts.length > 0 ? liveProducts : products;

  return productsToUse
    .map((product) => ({
      value: String(product.product_id),
      label: formatValue(product.product_name),
    }))
    .filter((option) => option.label !== EMPTY_VALUE);
}

export async function getProductCategoryOptions() {
  const response = await apiRequest("/product/getCategories");
  const categories = Array.isArray(response?.data) ? response.data : [];
  const activeCategories = categories.filter(isActiveCategory);
  const categoriesToUse =
    activeCategories.length > 0 ? activeCategories : categories;

  return categoriesToUse.map((category) => ({
    value: String(category.category_id),
    label: formatValue(category.category_name),
  }));
}

export async function updateProductStatus(productId, status) {
  const payload = new FormData();

  payload.set("product_id", String(productId));
  payload.set("product_status", normalizeSubmitStatus(status));

  return apiRequest("/product/updateProductStatus", {
    method: "POST",
    body: payload,
  });
}

export async function addProduct(formData) {
  const payload = new FormData();
  const variantData = buildVariantData(formData);
  const thumbnailImage = formData.get("thumbnail_image");

  if (variantData.length === 0) {
    throw new Error("Add at least one product variant.");
  }

  [
    "product_name",
    "category_id",
    "manage_inventory",
    "stock_in_pkts",
    "label_badge",
    "hsn",
    "gst",
    "meta_title",
    "meta_keywords",
    "meta_description",
  ].forEach((fieldName) => {
    payload.set(fieldName, String(formData.get(fieldName) ?? "").trim());
  });

  if (thumbnailImage instanceof File && thumbnailImage.size > 0) {
    payload.set("thumbnail_image", thumbnailImage);
  }

  payload.set("variant_data", JSON.stringify(variantData));

  return apiRequest("/product/addProduct", {
    method: "POST",
    body: payload,
  });
}
