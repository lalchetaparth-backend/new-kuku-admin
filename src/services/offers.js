import { createStatusSwitch } from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";
const offerStatusOptions = [
  { value: "active", label: "Live", badgeClass: "text-bg-success" },
  { value: "hold", label: "On Hold", badgeClass: "status-badge-inactive" },
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

function formatOfferAmount(value) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();
  const numericValue = Number(normalizedValue);

  if (Number.isNaN(numericValue)) {
    return formatValue(value);
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function formatOfferValue(offer) {
  const normalizedOfferType = String(offer.offer_type ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedOfferType === "flat" ||
    normalizedOfferType === "amount_wise" ||
    offer.offer_amount
  ) {
    return formatOfferAmount(offer.offer_amount);
  }

  return formatOfferPercentage(offer.offer_percentage);
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
    cartValue: formatOfferAmount(offer.cart_value),
    dateRange: formatDateRange(offer.startdate, offer.enddate),
    offer: formatOfferValue(offer),
    status: createStatusSwitch(
      normalizeOfferStatus(offer.is_active),
      offerStatusOptions,
      {
        activeValue: "active",
        interactive: true,
        showCurrentOnly: true,
      },
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

function formatRequiredNumber(formData, fieldName, label) {
  const value = formatRequiredValue(formData, fieldName, label);
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(`${label} must be a valid number.`);
  }

  return value;
}

function normalizeSubmitStatus(status) {
  return normalizeOfferStatus(status) === "active" ? "1" : "0";
}

export async function getOfferRows() {
  const response = await apiRequest("/product/get-offers");
  const offers = Array.isArray(response?.data) ? response.data : [];

  return offers.map(mapOfferToRow);
}

export async function addOffer(formData) {
  const payload = new FormData();
  const couponCode = normalizeCouponCode(formData.get("coupon_code"));
  const offerType = formatRequiredValue(formData, "offer_type", "Offer Type");

  if (!couponCode) {
    throw new Error("Coupen Code is required.");
  }

  if (offerType !== "percentage" && offerType !== "flat") {
    throw new Error("Select a valid offer type.");
  }

  payload.set("coupon_code", couponCode);
  payload.set(
    "startdate",
    formatRequiredValue(formData, "startdate", "Offer Starts From"),
  );
  payload.set(
    "enddate",
    formatRequiredValue(formData, "enddate", "Offer End to"),
  );
  payload.set("cart_value", formatRequiredNumber(formData, "cart_value", "Cart Value"));
  payload.set("offer_type", offerType);
  payload.set("is_active", "1");

  if (offerType === "percentage") {
    payload.set(
      "offer_percentage",
      formatRequiredNumber(formData, "offer_percentage", "Offer Percentage"),
    );
  }

  if (offerType === "flat") {
    payload.set(
      "offer_amount",
      formatRequiredNumber(formData, "offer_amount", "Offer Amount"),
    );
  }

  return apiRequest("/product/add-offer", {
    method: "POST",
    body: payload,
  });
}

export async function updateOfferStatus(offerId, status) {
  const normalizedOfferId = String(offerId ?? "").trim();

  if (!normalizedOfferId) {
    throw new Error("Offer id is missing.");
  }

  const payload = new FormData();

  payload.set("offer_id", normalizedOfferId);
  payload.set("is_active", normalizeSubmitStatus(status));

  return apiRequest("/product/update-offer-status", {
    method: "POST",
    body: payload,
  });
}
