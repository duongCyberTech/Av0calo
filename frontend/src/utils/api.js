export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchJSON(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const init = {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options,
    };

    if (init.body && typeof init.body === 'object') {
        init.body = JSON.stringify(init.body);
    }

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