import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function extractMarquees(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.marquee)) {
    return response.marquee;
  }

  if (Array.isArray(response?.marquees)) {
    return response.marquees;
  }

  return [];
}

function mapMarqueeToRow(marquee, index) {
  return {
    id: index + 1,
    marqueeId: marquee.id,
    title: formatValue(marquee.title),
  };
}

export async function getMarqueeRows() {
  const response = await apiRequest("/admin/get-marquee");

  return extractMarquees(response).map(mapMarqueeToRow);
}

export async function addMarquee(formData) {
  const title = String(formData.get("title") ?? "").trim();

  if (!title) {
    throw new Error("Marquee title is required.");
  }

  return apiRequest("/admin/add-marquee", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function deleteMarquee(marqueeId) {
  const normalizedMarqueeId = String(marqueeId ?? "").trim();

  if (!normalizedMarqueeId) {
    throw new Error("Marquee id is missing.");
  }

  return apiRequest("/admin/delete-marquee", {
    method: "POST",
    body: JSON.stringify({ id: Number(normalizedMarqueeId) }),
  });
}
