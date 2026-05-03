import { createStatusSwitch } from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const offerStatusOptions = [
  { value: "active", label: "Active", badgeClass: "text-bg-success" },
  { value: "hold", label: "On Hold", badgeClass: "text-bg-warning" },
];

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatDate(value) {
  if (!value) {
    return EMPTY_VALUE;
  }

  const parsedDate = new Date(String(value).trim());

  if (Number.isNaN(parsedDate.getTime())) {
    return formatValue(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function formatDateRange(startDate, endDate) {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  if (formattedStartDate === EMPTY_VALUE && formattedEndDate === EMPTY_VALUE) {
    return EMPTY_VALUE;
  }

  if (formattedStartDate === EMPTY_VALUE) {
    return formattedEndDate;
  }

  if (formattedEndDate === EMPTY_VALUE) {
    return formattedStartDate;
  }

  return `${formattedStartDate} - ${formattedEndDate}`;
}

function formatOfferPercentage(value) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();
  const numericValue = Number(normalizedValue);

  if (Number.isNaN(numericValue)) {
    return `${normalizedValue}%`;
  }

  return `${numericValue}%`;
}

function normalizeOfferStatus(value) {
  if (typeof value === "boolean") {
    return value ? "active" : "hold";
  }

  const normalizedValue = String(value ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedValue === "1" ||
    normalizedValue === "true" ||
    normalizedValue === "active" ||
    normalizedValue === "live" ||
    normalizedValue === "yes"
  ) {
    return "active";
  }

  return "hold";
}

function mapOfferToRow(offer, index) {
  return {
    id: index + 1,
    productName: formatValue(offer.product_name),
    dateRange: formatDateRange(offer.startdate, offer.enddate),
    offer: formatOfferPercentage(offer.offer_percentage),
    status: createStatusSwitch(
      normalizeOfferStatus(offer.is_active),
      offerStatusOptions,
    ),
    offerId: offer.id,
    productId: offer.product_id,
    couponCode: formatValue(offer.coupon_code),
  };
}

function formatRequiredValue(formData, fieldName, label) {
  const value = String(formData.get(fieldName) ?? "").trim();

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function normalizeCouponCode(value) {
  return String(value ?? "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

export async function getOfferRows() {
  const response = await apiRequest("/product/get-offers");
  const offers = Array.isArray(response?.data) ? response.data : [];

  return offers.map(mapOfferToRow);
}

export async function addOffer(formData) {
  const payload = new FormData();
  const couponCode = normalizeCouponCode(formData.get("coupon_code"));

  if (!couponCode) {
    throw new Error("Coupen Code is required.");
  }

  payload.set(
    "product_id",
    formatRequiredValue(formData, "product_id", "Product Name"),
  );
  payload.set(
    "offer_percentage",
    formatRequiredValue(formData, "offer_percentage", "Offer Percentage"),
  );
  payload.set("coupon_code", couponCode);
  payload.set(
    "startdate",
    formatRequiredValue(formData, "startdate", "Offer Starts From"),
  );
  payload.set(
    "enddate",
    formatRequiredValue(formData, "enddate", "Offer End to"),
  );
  payload.set("is_active", "1");

  return apiRequest("/product/add-offer", {
    method: "POST",
    body: payload,
  });
}
