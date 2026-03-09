/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.josephhanseldaiz.com';

/**
 * Get the full API URL for a given endpoint
 * @param endpoint - The API endpoint (e.g., '/auth/login')
 * @returns The full URL
 */
export function getApiUrl(endpoint: string): string {

  console.log(API_BASE_URL);
console.log(process.env.NEXT_PUBLIC_API_URL);
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  // Ensure base URL doesn't end with a slash
  const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
}

/**
 * Make a fetch request with proper error handling
 * @param endpoint - The API endpoint
 * @param options - Fetch options
 * @returns Promise with the response
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Make an authenticated API request
 * @param endpoint - The API endpoint
 * @param token - JWT token
 * @param options - Fetch options
 * @returns Promise with the response
 */
export async function authenticatedApiRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

