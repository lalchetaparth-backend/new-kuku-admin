import { createStatusSwitch, createTableImage, productPreviewImage } from "../data/shared";
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

function mapModalToRow(modal, index) {
  return {
    id: index + 1,
    image: resolveModalImage(modal),
    title: resolveModalTitle(modal),
    date: formatDate(modal.created_at ?? modal.updated_at),
    description: resolveModalDescription(modal),
    status: createStatusSwitch(normalizeModalStatus(modal.status), modalStatusOptions),
    uuid: modal.uuid,
  };
}

export async function getModalRows() {
  const response = await apiRequest("/web/popUpModal");
  const modals = normalizeModalItems(response);

  return modals.map(mapModalToRow);
}
