const API_BASE = "/admin/api"

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number
    ) {
        super(message)
        this.name = "ApiError"
    }
}

export async function apiFetch<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const url = `${API_BASE}${path}`
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    })

    if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new ApiError(
            body?.error?.message ?? `Request failed: ${res.statusText}`,
            res.status
        )
    }

    return res.json() as Promise<T>
}

export const api = {
    get: <T>(path: string) => apiFetch<T>(path),
    post: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),
    put: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, {
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),
    patch: <T>(path: string, body?: unknown) =>
        apiFetch<T>(path, {
            method: "PATCH",
            body: body ? JSON.stringify(body) : undefined,
        }),
    delete: <T>(path: string) =>
        apiFetch<T>(path, { method: "DELETE" }),
}
