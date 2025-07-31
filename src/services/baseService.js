
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; 

function mapMethod(method) {
  const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  const upperMethod = method.toUpperCase();

  if (!allowedMethods.includes(upperMethod)) {
    throw new Error(`Método HTTP no soportado: ${method}`);
  }

  return upperMethod;
}

async function checkStatus(response) {
  if (response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return response.json();
    }
    return null; 
  } else {
    let errorMessage = 'Error en la petición';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
    }
    throw new Error(errorMessage);
  }
}

function buildHeaders(entity, extraHeaders = {}) {
  const token = localStorage.getItem('token');

  const baseHeaders = {
    'Content-Type': 'application/json',
    ...(entity !== 'auth' && token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return { ...baseHeaders, ...extraHeaders };
}

function buildUrl(baseUrl, entity, path = '', query = {}) {
  const url = new URL(`${baseUrl}/${entity}${path ? `/${path}` : ''}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

async function request({ method = 'GET', entity = '', path = '', query = {}, body = null, headers = {} }) {
  const url = buildUrl(API_BASE_URL, entity, path, query);
  console.log('request sent to:', url);

  const httpMethod = mapMethod(method);
  const combinedHeaders = buildHeaders(entity, headers);

  const fetchOptions = {
    method: httpMethod,
    headers: combinedHeaders,
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  return checkStatus(response);
}



export const baseService = {
  request,
  get: (entity, path = '', headers = {}) => request({ method: 'GET', entity, path, headers }),
  getPaginated: (entity, path = '', query = {}, headers = {}) =>
    request({ method: 'GET', entity, path, query, headers }),
  post: (entity, body, headers = {}) =>
    request({ method: 'POST', entity, body, headers }),
  patch: (entity, path, body, headers = {}) =>
    request({ method: 'PATCH', entity, path, body, headers }),
  delete: (entity, path, headers = {}) =>
    request({ method: 'DELETE', entity, path, headers }),
};
