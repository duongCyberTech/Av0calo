export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchJSON(path, options = {}) {
    const url = `${API_BASE}${path}`;
    
    // Prepare body and headers
    let body = options.body;
    const headers = {
        ...(options.headers || {})
    };
    
    // Only set Content-Type and stringify if we have a body
    if (body && typeof body === 'object') {
        body = JSON.stringify(body);
        headers['Content-Type'] = 'application/json';
    }
    
    const init = {
        ...options,
        headers,
        body
    };

    console.log('Sending request:', { url, method: init.method, headers: init.headers, body: init.body });

    const res = await fetch(url, init);
    const text = await res.text();
    try {
        const json = text ? JSON.parse(text) : null;
        if (!res.ok) throw { status: res.status, body: json };
        return json;
    } catch (err) {
        if (!res.ok) throw { status: res.status, body: text || err };
        throw err;
    }
}