// utils/types.ts
import type { RequestInit } from "next/dist/compiled/@edge-runtime/fetch";

export type FetchOptions = RequestInit & {
  retries?: number;           // Number of retries on failure (default 3)
  retryDelay?: number;        // Delay between retries in ms (default 500)
  cacheKey?: string;          // Optional cache key for in-memory cache
  timeoutMs?: number;         // Request timeout in milliseconds
  signal?: AbortSignal;       // Optional external abort signal for cancellation
};
