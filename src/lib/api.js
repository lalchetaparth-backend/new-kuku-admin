const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim();

function resolveApiBaseUrl() {
  if (!RAW_API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is missing. Check your .env file.");
  }

  if (!import.meta.env.DEV) {
    return RAW_API_BASE_URL;
  }

  try {
    const parsedUrl = new URL(RAW_API_BASE_URL);

    return parsedUrl.pathname.replace(/\/$/, "") || "/";
  } catch {
    return RAW_API_BASE_URL;
  }
}

const API_BASE_URL = resolveApiBaseUrl();

function buildApiUrl(path) {
  const normalizedBaseUrl =
    API_BASE_URL === "/" ? "" : API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  const isFormData = options.body instanceof FormData;

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildApiUrl(path), {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null
        ? payload.message || payload.msg || payload.error
        : null;

    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  return payload;
}

export { API_BASE_URL };
