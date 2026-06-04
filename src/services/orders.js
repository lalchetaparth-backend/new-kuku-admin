import { createIconLink, createStatusSwitch } from "../data/shared";
import { apiRequest } from "../lib/api";
import { getAdminToken } from "./auth";

const EMPTY_VALUE = "-";
const orderStatusOptions = [
  { value: "pending", label: "Pending", badgeClass: "text-bg-warning" },
  { value: "success", label: "Success", badgeClass: "text-bg-success" },
  { value: "cancel", label: "Cancel", badgeClass: "text-bg-danger" },
];

function formatValue(value) {
  if (value === null || value === undefined) {
    return EMPTY_VALUE;
  }

  const normalizedValue = String(value).trim();

  return normalizedValue || EMPTY_VALUE;
}

function formatAmount(value) {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return formatValue(value);
  }

  return `${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(numericValue)}/-`;
}

function normalizeOrderStatus(status) {
  const normalizedStatus = String(status ?? "")
    .trim()
    .toLowerCase();

  if (
    normalizedStatus === "success" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "complete" ||
    normalizedStatus === "delivered"
  ) {
    return "success";
  }

  if (
    normalizedStatus === "cancel" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {
    return "cancel";
  }

  return "pending";
}

function formatContact(order) {
  return formatValue(order.user?.mobile ?? order.mobile ?? order.phone);
}

function formatCity(order) {
  return formatValue(order.user?.city ?? order.city);
}

function normalizeLookupKey(value) {
  return String(value ?? "").trim();
}

function buildProductNameLookup(products) {
  return products.reduce((lookup, product) => {
    const productId = normalizeLookupKey(product.product_id ?? product.id);
    const productName = formatValue(product.product_name ?? product.name);

    if (productId && productName !== EMPTY_VALUE) {
      lookup.set(productId, productName);
    }

    return lookup;
  }, new Map());
}

async function getProductNameLookup() {
  const response = await apiRequest("/product/getProducts");
  const products = Array.isArray(response?.data) ? response.data : [];

  return buildProductNameLookup(products);
}

function resolveProductName(item, productNameById) {
  const productId = normalizeLookupKey(item.product_id);

  return formatValue(
    item.product?.product_name ??
      item.product?.name ??
      item.product_name ??
      productNameById.get(productId) ??
      (productId ? `Product #${productId}` : EMPTY_VALUE),
  );
}

function formatProductItems(items, productNameById) {
  if (!Array.isArray(items) || items.length === 0) {
    return EMPTY_VALUE;
  }

  return items.map((item) =>
    `${resolveProductName(item, productNameById)} (Qty: ${formatValue(item.quantity)})`,
  );
}

function formatQuantity(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return EMPTY_VALUE;
  }

  const totalQuantity = items.reduce((total, item) => {
    const quantity = Number(item.quantity);

    return Number.isFinite(quantity) ? total + quantity : total;
  }, 0);

  return totalQuantity > 0 ? String(totalQuantity) : EMPTY_VALUE;
}

function mapOrderToRow(order, index, productNameById) {
  const items = Array.isArray(order.items) ? order.items : [];

  return {
    id: index + 1,
    customer: formatValue(order.user?.name ?? order.customer_name ?? order.name),
    contact: formatContact(order),
    city: formatCity(order),
    product: formatProductItems(items, productNameById),
    qty: formatQuantity(items),
    total: formatAmount(order.total_amount),
    status: createStatusSwitch(
      normalizeOrderStatus(order.status),
      orderStatusOptions,
      { activeValue: "success", showCurrentOnly: true },
    ),
    downloads: createIconLink("bi bi-filetype-pdf"),
    orderId: order.id,
    orderNumber: formatValue(order.order_id),
    email: formatValue(order.email ?? order.user?.email),
    paymentStatus: formatValue(order.payment_status),
    paymentMode: formatValue(order.payment_mode),
    deliveryCharge: formatAmount(order.delivery_charge),
    rawOrder: order,
  };
}

export async function getOrderRows() {
  const token = getAdminToken();
  const [ordersResponse, productNameById] = await Promise.all([
    apiRequest("/order/list-all", {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }),
    getProductNameLookup().catch(() => new Map()),
  ]);
  const orders = Array.isArray(ordersResponse?.data) ? ordersResponse.data : [];

  return orders.map((order, index) =>
    mapOrderToRow(order, index, productNameById),
  );
}
