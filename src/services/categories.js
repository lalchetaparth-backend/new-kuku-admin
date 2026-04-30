import { apiRequest } from "../lib/api";

export async function getCategories() {
  return apiRequest("/product/getCategories", {
    method: "GET",
  });
}

export async function updateCategoryStatus(categoryId, status) {
  const payload = new FormData();
  payload.set("category_id", String(categoryId));
  payload.set("category_status", status);

  return apiRequest("/product/updateCategoryStatus", {
    method: "POST",
    body: payload,
  });
}

export async function addCategory(formData) {
  const payload = new FormData();
  
  payload.set("category_name", String(formData.get("category_name") ?? "").trim());
  payload.set("category_status", String(formData.get("category_status") ?? "Active").trim());
  
  const categoryImage = formData.get("category_image");
  if (categoryImage instanceof File && categoryImage.size > 0) {
    payload.set("category_image", categoryImage);
  }

  return apiRequest("/product/addCategory", {
    method: "POST",
    body: payload,
  });
}
