import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const FALLBACK_IMAGE = "/assets/images/kuku-namkeen-logo.png";

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function getFirstValue(source, fieldNames) {
  for (const fieldName of fieldNames) {
    const value = source?.[fieldName];

    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return value;
    }
  }

  return "";
}

function extractBlogAds(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.blog_ads)) {
    return response.blog_ads;
  }

  if (Array.isArray(response?.blogAds)) {
    return response.blogAds;
  }

  return [];
}

function normalizeStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "1" ||
    normalizedStatus === "active" ||
    normalizedStatus === "live" ||
    normalizedStatus === "yes"
  ) {
    return "active";
  }

  return "hold";
}

function normalizeSubmitStatus(status) {
  return normalizeStatus(status) === "active" ? "1" : "0";
}

function resolveImageSrc(value) {
  const imagePath = String(value ?? "").trim();

  if (!imagePath) {
    return FALLBACK_IMAGE;
  }

  if (/^(https?:)?\/\//i.test(imagePath) || imagePath.startsWith("/")) {
    return imagePath;
  }

  return `/${imagePath.replace(/^\/+/, "")}`;
}

function createCategoryNameLookup(categoryOptions = []) {
  return categoryOptions.reduce((lookup, option) => {
    const value = String(option.value ?? "").trim();
    const label = formatValue(option.label);

    if (value && label !== EMPTY_VALUE) {
      lookup.set(value, label);
    }

    return lookup;
  }, new Map());
}

function formatCategory(blogAd, categoryNameById) {
  const directCategory = getFirstValue(blogAd, [
    "category_name",
    "categoryName",
    "category",
  ]);

  if (typeof directCategory === "object" && directCategory !== null) {
    return formatValue(directCategory.category_name ?? directCategory.name);
  }

  if (directCategory) {
    return formatValue(directCategory);
  }

  const categoryId = getFirstValue(blogAd, ["category_id", "categoryId"]);

  return categoryNameById.get(String(categoryId).trim()) ?? formatValue(categoryId);
}

export function mapBlogAdsToRows(blogAds, categoryOptions = []) {
  const categoryNameById = createCategoryNameLookup(categoryOptions);

  return blogAds.map((blogAd, index) => {
    const blogAdId = getFirstValue(blogAd, [
      "blog_ad_id",
      "blogAdId",
      "blog_advertisement_id",
      "ad_id",
      "id",
    ]);
    const image = getFirstValue(blogAd, [
      "image",
      "blog_ad_image",
      "blogAdImage",
      "file",
      "photo",
    ]);

    return {
      id: index + 1,
      blogAdId,
      image: resolveImageSrc(image),
      title: formatValue(
        getFirstValue(blogAd, ["title", "adv_title", "ad_title", "name"]),
      ),
      category: formatCategory(blogAd, categoryNameById),
      status: normalizeStatus(getFirstValue(blogAd, ["status", "ad_status"])),
    };
  });
}

export async function getBlogAds(categoryOptions = []) {
  const response = await apiRequest("/admin/getBlogAds");

  return mapBlogAdsToRows(extractBlogAds(response), categoryOptions);
}

export async function addBlogAd(formData) {
  const payload = new FormData();
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const image = formData.get("image");

  if (!title) {
    throw new Error("Advertisement title is required.");
  }

  if (!categoryId) {
    throw new Error("Please select a category.");
  }

  payload.set("title", title);
  payload.set("category_id", categoryId);
  payload.set("status", "1");

  if (image instanceof File && image.size > 0) {
    payload.set("image", image);
  }

  return apiRequest("/admin/addBlogAd", {
    method: "POST",
    body: payload,
  });
}

export async function updateBlogAdStatus(blogAdId, status) {
  const normalizedBlogAdId = String(blogAdId ?? "").trim();

  if (!normalizedBlogAdId) {
    throw new Error("Blog advertisement id is missing.");
  }

  const payload = new FormData();

  payload.set("id", normalizedBlogAdId);
  payload.set("status", normalizeSubmitStatus(status));

  return apiRequest("/admin/updateBlogAdStatus", {
    method: "POST",
    body: payload,
  });
}
