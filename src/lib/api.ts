const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://todo-backend-chi-wine.vercel.app';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => ({}))) as T & { message?: string };

  if (!response.ok) {
    throw new ApiError((data as { message?: string }).message || 'Request failed', response.status);
  }

  return data;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });

  return parseResponse<T>(response);
}

export function fireAndForget<T>(
  promise: Promise<T>,
  onError?: (error: unknown) => void,
): void {
  promise.catch((error) => {
    if (onError) {
      onError(error);
      return;
    }
    // Swallow unhandled async errors when intentionally not awaiting.
    // eslint-disable-next-line no-console
    console.error(error);
  });
}
