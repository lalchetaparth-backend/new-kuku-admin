import { apiRequest } from "../lib/api";

const ADMIN_SESSION_STORAGE_KEY = "kuku_admin_session";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readStoredSession() {
  const storage = getStorage();

  if (!storage) {
    return null;
  }

  const rawSession = storage.getItem(ADMIN_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession);

    if (
      parsedSession &&
      typeof parsedSession === "object" &&
      typeof parsedSession.token === "string" &&
      parsedSession.token.trim()
    ) {
      return parsedSession;
    }
  } catch {
    storage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  }

  return null;
}

export function getAdminSession() {
  return readStoredSession();
}

export function getAdminToken() {
  return readStoredSession()?.token ?? "";
}

export function isAdminAuthenticated() {
  return Boolean(getAdminToken());
}

export function clearAdminSession() {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ADMIN_SESSION_STORAGE_KEY);
}

export function saveAdminSession(session) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export async function adminLogin({ email, password }) {
  const normalizedEmail = String(email ?? "").trim();
  const normalizedPassword = String(password ?? "");

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }

  if (!normalizedPassword) {
    throw new Error("Password is required.");
  }

  const payload = new FormData();
  payload.set("email", normalizedEmail);
  payload.set("password", normalizedPassword);

  const response = await apiRequest("/admin/adminLogin", {
    method: "POST",
    body: payload,
  });

  if (!response || response.status !== true || !String(response.token ?? "").trim()) {
    throw new Error(
      String(response?.message ?? "Unable to login. Please check your credentials."),
    );
  }

  const session = {
    email: String(response.email ?? normalizedEmail).trim(),
    token: String(response.token).trim(),
  };

  saveAdminSession(session);

  return {
    ...response,
    session,
  };
}
