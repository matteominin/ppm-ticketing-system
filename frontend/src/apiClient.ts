const API_URL = import.meta.env.VITE_API_URL;

interface TokenResponse {
    access: string;
    refresh?: string;
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    const response = await fetch(`${API_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
        return null;
    }

    const data: TokenResponse = await response.json();
    if (data.access) {
        localStorage.setItem('access_token', data.access);
        return data.access;
    }

    return null;
}

const forceLogOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
}

export async function apiFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    let accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    let combinedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (init?.headers && typeof init.headers === 'object' && !Array.isArray(init.headers)) {
        combinedHeaders = { ...combinedHeaders, ...(init.headers as Record<string, string>) };
    }

    if (accessToken) {
        combinedHeaders['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(input, {
        ...init,
        headers: combinedHeaders,
    });


    if (response.status !== 401) {
        // Not unauthorized, return response immediately
        return response;
    }

    // 401 Unauthorized, maybe token expired -> try refresh token
    if (!refreshToken) {
        forceLogOut();
        return response;
    }

    const newAccessToken = await refreshAccessToken(refreshToken);

    if (!newAccessToken) {
        forceLogOut();
        return response;
    }

    // Retry original request with new access token
    const retryResponse = await fetch(input, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
            Authorization: `Bearer ${newAccessToken}`,
        },
    });

    return retryResponse;
}
