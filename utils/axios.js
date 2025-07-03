import axios from "axios";
import { setupCache, buildMemoryStorage } from "axios-cache-interceptor";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    timeout: 3000,
  },
  withCredentials: true,
});

const cachedAxios = setupCache(instance, {
  // Cache for 5 minutes by default
  ttl: 5 * 60 * 1000,
  // Cache responses in memory
  storage: buildMemoryStorage(),
  // Cache GET requests by default
  methods: ["get"],
  // Generate cache key based on URL, method, and params
  generateKey: ({ url, method, params, data }) => {
    return `${method}-${url}-${JSON.stringify(params || {})}-${JSON.stringify(
      data || {}
    )}`;
  },
  // Enable debug mode (optional)
  debug: process.env.NODE_ENV === "development",
});

export default cachedAxios;
