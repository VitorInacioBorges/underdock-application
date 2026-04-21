const API_URL = import.meta.env.VITE_API_URL;

class ApiClient {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    let data = null;
    const contentType = response.headers.get('content-type') || '';

    if (options.responseType === 'blob') {
      data = await response.blob();
    } else if (options.responseType === 'text') {
      data = await response.text();
    } else if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.startsWith('text/')) {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }

      const message =
        data?.message ||
        data?.error ||
        (typeof data === 'string' ? data : `Erro HTTP: ${response.status}`);

      const error = new Error(message);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();