import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function getApiProxy(apiBaseUrl) {
  if (!apiBaseUrl) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(apiBaseUrl);
    const proxyPath = parsedUrl.pathname.replace(/\/$/, "") || "/";

    return {
      [proxyPath]: {
        target: parsedUrl.origin,
        changeOrigin: true,
        secure: true,
      },
    };
  } catch {
    return undefined;
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = getApiProxy(env.VITE_API_BASE_URL);

  return {
    plugins: [react()],
    server: proxy ? { proxy } : undefined,
  };
});
