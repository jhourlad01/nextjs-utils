// utils/apiClient.ts
import type { FetchOptions, CacheEntry } from "./types";

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes TTL for cache entries

async function fetchWithTimeout(resource: RequestInfo, options: FetchOptions) {
  const { timeoutMs = 5000, signal, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Combine external signal with internal abort controller
  const combinedSignal = signal
    ? new AbortController()
    : controller;

  if (signal) {
    signal.addEventListener("abort", () => combinedSignal.abort());
    controller.signal.addEventListener("abort", () => combinedSignal.abort());
  }

  try {
    const response = await fetch(resource, { ...fetchOptions, signal: combinedSignal.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function apiClient<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const {
    retries = 3,
    retryDelay = 500,
    cacheKey,
    timeoutMs = 5000,
    signal,
    ...fetchOptions
  } = options;

  if (cacheKey) {
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return cached.data;
    }
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetchWithTimeout(url, { ...fetchOptions, timeoutMs, signal });
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }
      const data: T = await response.json();

      if (cacheKey) {
        cache.set(cacheKey, { timestamp: Date.now(), data });
      }
      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("Request aborted");
      }

      if (attempt === retries) throw error;

      const backoff = retryDelay * 2 ** attempt;
      const jitter = Math.random() * 100;
      await new Promise((r) => setTimeout(r, backoff + jitter));
      attempt++;
    }
  }

  throw new Error("Unexpected error in apiClient");
}

export function clearApiClientCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export function buildQueryString(params: Record<string, any>): string {
  const esc = encodeURIComponent;
  return Object.entries(params)
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join("&");
}

export function debounce<F extends (...args: any[]) => void>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

export function throttle<F extends (...args: any[]) => void>(func: F, limit: number) {
  let inThrottle: boolean;
  return (...args: Parameters<F>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
