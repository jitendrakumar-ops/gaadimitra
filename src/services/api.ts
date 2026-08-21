/**
 * Base API Client Configuration & Helpers
 * Ready for future backend integration (e.g., Axios / Fetch wrapper)
 */

export interface RequestConfig extends RequestInit {
  baseUrl?: string;
  token?: string;
}

declare const process: {
  env: {
    API_BASE_URL?: string;
    [key: string]: string | undefined;
  };
};

// Configurable base URL (can be read from env in production)
export const API_BASE_URL = (typeof process !== 'undefined' && process.env?.API_BASE_URL) || 'https://api.gaadimitra.com/v1';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const { baseUrl = this.baseUrl, token, headers = {}, ...rest } = options;
    const url = `${baseUrl}${endpoint}`;

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers as Record<string, string>),
    };

    if (__DEV__) {
      console.log(`🌐 [HTTP ${options.method || 'GET'}] ${url}`, {
        headers: defaultHeaders,
        body: rest.body,
      });
    }

    const response = await fetch(url, {
      ...rest,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (__DEV__) {
        console.warn(`❌ [HTTP ${response.status}] ${url}`, errorData);
      }
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (__DEV__) {
      console.log(`✅ [HTTP ${response.status}] ${url}`, data);
    }
    return data;
  }

  get<T>(endpoint: string, options?: RequestConfig) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: any, options?: RequestConfig) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient();

/**
 * Test API function that performs a real HTTP request to test Network Tab
 */
export async function sendTestNetworkRequest(): Promise<{ status: number; data: any }> {
  const url = 'https://jsonplaceholder.typicode.com/posts';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      title: 'GaadiMitra Network Tab Test',
      body: 'Network inspection verified successfully!',
      timestamp: new Date().toISOString(),
      app: 'GaadiMitra',
    }),
  });

  const data = await response.json();
  return { status: response.status, data };
}
