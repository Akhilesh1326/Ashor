import { config } from './config/env';

// all communication with Ashor is plain HTTP for now

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${config.ashorUrl}${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        throw new Error(`Ashor ${init?.method ?? 'GET'} ${path} failed with ${response.status}`);
    }

    return response.json() as Promise<T>;
}

export function createWorkflow(params: { name?: string, type: 'queue' | 'concurrent' }) {
    return request<{ id: string }>('/orchestration/workflow', {
        method: 'POST',
        body: JSON.stringify(params),
    });
}

export function getWorkflows() {
    return request<{ workflows: object[] }>('/orchestration/workflows');
}
