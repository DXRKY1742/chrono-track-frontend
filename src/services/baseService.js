
const API_BASE_URL = import.meta.env.BACKEND_URL; 

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
      // no hace nada si no puede parsear json
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

function buildUrl(baseUrl, entity, options = '') {
  return `${baseUrl}/${entity}${options ? `/${options}` : ''}`;
}

async function request({ method = 'GET', entity = '', options = '', body = null, headers = {} }) {
  const url = buildUrl(API_BASE_URL, entity, options);
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
  get: (entity, options = '', headers = {}) => request({ method: 'GET', entity, options, headers }),
  post: (entity, body, headers = {}) => request({ method: 'POST', entity, body, headers }),
  patch: (entity, options, body, headers = {}) => request({ method: 'PATCH', entity, options, body, headers }),
  delete: (entity, options, headers = {}) => request({ method: 'DELETE', entity, options, headers }),
};
