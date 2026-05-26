import {
  createDeleteLink,
  createStatusSwitch,
  createTableImage,
  productPreviewImage,
} from "../data/shared";
import { apiRequest } from "../lib/api";

const EMPTY_VALUE = "-";

const modalStatusOptions = [
  { value: "live", label: "Live", badgeClass: "text-bg-success" },
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

  const normalizedValue = String(value).trim().replace(" ", "T");
  const parsedDate = new Date(normalizedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return formatValue(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function normalizeModalStatus(status) {
  if (typeof status === "boolean") {
    return status ? "live" : "hold";
  }

  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "true" ||
    normalizedStatus === "1" ||
    normalizedStatus === "active" ||
    normalizedStatus === "live"
  ) {
    return "live";
  }

  return "hold";
}

function normalizeModalItems(response) {
  const primaryData = response?.data;

  if (Array.isArray(primaryData)) {
    return primaryData;
  }

  if (Array.isArray(primaryData?.data)) {
    return primaryData.data;
  }

  if (primaryData?.data && typeof primaryData.data === "object") {
    return [primaryData.data];
  }

  if (primaryData && typeof primaryData === "object") {
    return [primaryData];
  }

  return [];
}

function resolveModalTitle(modal) {
  return formatValue(modal.header ?? modal.title ?? modal.name);
}

function resolveModalDescription(modal) {
  return formatValue(modal.description ?? modal.content ?? modal.modal_description);
}

function resolveModalImage(modal) {
  const imageSrc = formatValue(modal.image);

  if (imageSrc === EMPTY_VALUE) {
    return createTableImage(productPreviewImage, resolveModalTitle(modal));
  }

  return createTableImage(imageSrc, resolveModalTitle(modal));
}

function formatRequiredValue(formData, fieldName, label) {
  const value = String(formData.get(fieldName) ?? "").trim();

  if (!value) {
    throw new Error(`${label} is required.`);
  }

  return value;
}

function normalizeSubmitStatus(value) {
  return normalizeModalStatus(value) === "live" ? "1" : "0";
}

function mapModalToRow(modal, index) {
  return {
    id: index + 1,
    image: resolveModalImage(modal),
    title: resolveModalTitle(modal),
    date: formatDate(modal.created_at ?? modal.updated_at),
    description: resolveModalDescription(modal),
    status: createStatusSwitch(normalizeModalStatus(modal.status), modalStatusOptions),
    delete: createDeleteLink(),
    uuid: modal.uuid,
  };
}

export async function getModalRows() {
  const response = await apiRequest("/web/popUpModal");
  const modals = normalizeModalItems(response);

  return modals.map(mapModalToRow);
}

export async function addModal(formData) {
  const payload = new FormData();
  const image = formData.get("image");

  payload.set("header", formatRequiredValue(formData, "header", "Modal Title"));
  payload.set(
    "description",
    formatRequiredValue(formData, "description", "Modal Description"),
  );
  payload.set("status", normalizeSubmitStatus(formData.get("status") ?? "1"));

  if (image instanceof File && image.size > 0) {
    payload.set("image", image);
  }

  const response = await apiRequest("/web/addPopUpModal", {
    method: "POST",
    body: payload,
  });

  if (
    typeof response === "object" &&
    response !== null &&
    typeof response.message === "string"
  ) {
    return {
      ...response,
      msg: response.message,
    };
  }

  return response;
}

export async function deleteModal(uuid) {
  const normalizedUuid = String(uuid ?? "").trim();

  if (!normalizedUuid) {
    throw new Error("Modal uuid is missing.");
  }

  const response = await apiRequest("/web/deletePopUpModal", {
    method: "POST",
    body: JSON.stringify({ uuid: normalizedUuid }),
  });

  if (
    typeof response === "object" &&
    response !== null &&
    typeof response.message === "string"
  ) {
    return {
      ...response,
      msg: response.message,
    };
  }

  return response;
}
