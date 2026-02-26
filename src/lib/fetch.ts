const DEFAULT_TIMEOUT = 12000;
const DEFAULT_RETRIES = 2;

export async function fetchWithRetry(url: string, init?: RequestInit, retries = DEFAULT_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
      const res = await fetch(url, {
        ...init,
        headers: {
          'user-agent': 'IllyrianEditorial/1.0',
          ...init?.headers
        },
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (error) {
      if (attempt === retries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 320 * (attempt + 1)));
    }
  }
  throw new Error('fetch failure');
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetchWithRetry(url, init);
  return (await res.json()) as T;
}
