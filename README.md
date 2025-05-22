# nextjs-utils

Advanced utility functions for API requests and client-side helpers in Next.js projects.

## Features

- Robust `apiClient` with:
  - Automatic retries with exponential backoff and jitter
  - Request timeout and cancellation support via `AbortController`
  - In-memory caching with TTL support
  - Customizable fetch options
- Helpers:
  - Query string builder (`buildQueryString`)
  - Client-side `debounce` and `throttle` functions
- Written in TypeScript with clear type definitions

## Installation

Copy the `utils` folder into your Next.js project or install via your preferred method.

## Usage

### API Client

```ts
import { apiClient, clearApiClientCache, buildQueryString } from './utils/apiClient';

const data = await apiClient<MyDataType>('https://api.example.com/data', {
  retries: 5,
  timeoutMs: 7000,
  cacheKey: 'example-data',
});
