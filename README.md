# nextjs-utils

A collection of advanced utility functions for Next.js projects to simplify API interactions and blockchain smart contract integration.

⚠️ Disclaimer
This repository contains some of my commonly-used code snippets and utilities for my Next.js projects intended for myy own personal use. You are free to use and adapt the code as you wish, but it is provided as-is with no warranty or guarantees of suitability or correctness. Use at your own risk.


## Features

- **API Client Utilities**
  - Robust fetch wrapper with automatic retries, exponential backoff, and jitter
  - Request timeout and cancellation support
  - In-memory caching with TTL for efficient data fetching
  - Query string builder
  - Client-side debounce and throttle helpers

- **Smart Contract Utilities**
  - Easy wallet connection (e.g., MetaMask) and provider setup
  - Contract instance management via ABI and address
  - Read-only contract calls
  - Sending transactions for contract methods (e.g., buy/sell triggers)
  - Transaction confirmation handling

## Installation

Copy the `utils` folder into your Next.js project or integrate the utility files as needed.

## Usage Examples

### Connecting to Third-Party APIs with `apiClient`

```ts
import { apiClient } from './utils/apiClient';

const userData = await apiClient<User>('https://api.example.com/users/123', {
  retries: 3,
  timeoutMs: 7000,
  cacheKey: 'user-123',
});
