import {
  createActionButton,
  createDeleteLink,
  createStatusSwitch,
} from "../data/shared";
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
  const sku = String(formData.get("sku") ?? "").trim();

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
    .filter(([, variant]) =>
      Object.values(variant).some((value) => String(value).trim() !== ""),
    )
    .map(([, variant]) => ({
      weight: variant.weight ?? "",
      product_price: variant.price ?? "",
      product_sell_price: variant.mrp ?? "",
      item_weight: variant.itemWeight ?? "",
      item_length: variant.itemLength ?? "",
      item_width: variant.itemWidth ?? "",
      item_height: variant.itemHeight ?? "",
      sku,
    }));
}

function getFiles(formData, fieldName) {
  return formData
    .getAll(fieldName)
    .filter((file) => file instanceof File && file.size > 0);
}

function setTextField(payload, formData, payloadFieldName, formFieldName = payloadFieldName) {
  payload.set(payloadFieldName, String(formData.get(formFieldName) ?? "").trim());
}

function normalizeSavourValue(value) {
  return String(value ?? "").trim() === "1" ? "1" : "0";
}

function isActiveCategory(category) {
  const normalizedStatus = String(category?.category_status ?? "")
    .trim()
    .toLowerCase();

  return normalizedStatus === "active" || normalizedStatus === "live";
}

async function getCategoriesData() {
  const response = await apiRequest("/product/getCategories");

  return Array.isArray(response?.data) ? response.data : [];
}

function normalizeLookupKey(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function buildCategoryNameLookup(categories) {
  return categories.reduce((lookup, category) => {
    const categoryId = normalizeLookupKey(category.category_id ?? category.id);
    const categoryName = formatValue(category.category_name ?? category.name);

    if (categoryId && categoryName !== EMPTY_VALUE) {
      lookup.set(categoryId, categoryName);
    }

    return lookup;
  }, new Map());
}

function resolveCategoryLookupValue(value, categoryNameById) {
  const lookupKey = normalizeLookupKey(value);

  if (!lookupKey) {
    return EMPTY_VALUE;
  }

  return categoryNameById.get(lookupKey) ?? formatValue(value);
}

function formatCategory(product, categoryNameById = new Map()) {
  if (product.category_name) {
    return formatValue(product.category_name);
  }

  if (product.category?.category_name) {
    return formatValue(product.category.category_name);
  }

  if (product.category?.name) {
    return formatValue(product.category.name);
  }

  if (product.product_type) {
    return resolveCategoryLookupValue(product.product_type, categoryNameById);
  }

  if (product.category_id !== null && product.category_id !== undefined) {
    return resolveCategoryLookupValue(product.category_id, categoryNameById);
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

function mapProductToRow(product, index, categoryNameById) {
  return {
    id: index + 1,
    productName: formatValue(product.product_name),
    weight: formatWeight(product),
    category: formatCategory(product, categoryNameById),
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
    moreDetails: createActionButton(
      "productVariants",
      "bi bi-search",
      "btn btn-primary btn-sm",
    ),
    delete: createDeleteLink(),
    productId: product.product_id,
    product,
    thumbnailImage: product.thumbnail_image,
    variants: Array.isArray(product.variant_data) ? product.variant_data : [],
  };
}

export async function getProductRows() {
  const [productsResponse, categories] = await Promise.all([
    apiRequest("/product/getProducts"),
    getCategoriesData().catch(() => []),
  ]);
  const products = Array.isArray(productsResponse?.data) ? productsResponse.data : [];
  const categoryNameById = buildCategoryNameLookup(categories);

  return products.map((product, index) =>
    mapProductToRow(product, index, categoryNameById),
  );
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
  const categories = await getCategoriesData();
  const activeCategories = categories.filter(isActiveCategory);
  const categoriesToUse =
    activeCategories.length > 0 ? activeCategories : categories;

  return categoriesToUse.map((category) => ({
    value: String(category.category_id ?? category.id ?? ""),
    label: formatValue(category.category_name ?? category.name),
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

export async function deleteProduct(productId) {
  const normalizedProductId = String(productId ?? "").trim();

  if (!normalizedProductId) {
    throw new Error("Product id is missing.");
  }

  return apiRequest("/product/deleteProduct", {
    method: "DELETE",
    body: JSON.stringify({ product_id: Number(normalizedProductId) }),
  });
}

export async function addProduct(formData) {
  const payload = new FormData();
  const variantData = buildVariantData(formData);
  const thumbnailImage = formData.get("thumbnail_image");
  const nutritionFactsImage = formData.get("nutrition_facts");
  const perkIcons = getFiles(formData, "perks_icon").slice(0, 4);
  const otherImages = getFiles(formData, "other_images");

  if (variantData.length === 0) {
    throw new Error("Add at least one product variant.");
  }

  [
    "product_name",
    "category_id",
    "manage_inventory",
    "label_badge",
    "hsn",
    "gst",
    "sku",
    "meta_title",
    "meta_keywords",
    "meta_description",
    "product_description",
    "ingredients",
    "other_information",
    "self_life",
  ].forEach((fieldName) => setTextField(payload, formData, fieldName));
  payload.set("is_savour", normalizeSavourValue(formData.get("is_savour")));
  setTextField(payload, formData, "stock_in_pkts");

  if (thumbnailImage instanceof File && thumbnailImage.size > 0) {
    payload.set("thumbnail_image", thumbnailImage);
  }

  if (nutritionFactsImage instanceof File && nutritionFactsImage.size > 0) {
    payload.set("nutrition_facts_image", nutritionFactsImage);
  }

  perkIcons.forEach((perkIcon, index) => {
    payload.set(`perk_icon_${index + 1}`, perkIcon);
  });

  otherImages.forEach((otherImage) => {
    payload.append("other_images[]", otherImage);
  });

  payload.set("variant_data", JSON.stringify(variantData));

  return apiRequest("/product/addProduct", {
    method: "POST",
    body: payload,
  });
}
