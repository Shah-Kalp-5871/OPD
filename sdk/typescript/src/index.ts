export interface MedFlowClientOptions {
  apiKey: string;
  baseUrl?: string;
}

export class MedFlowClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(options: MedFlowClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? 'https://api.medflow.health/api';
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      throw new Error(`MedFlow API error: ${res.status}`);
    }
    return res.json() as Promise<T>;
  }

  readonly patients = {
    list: (params?: { search?: string; limit?: number; offset?: number }) => {
      const q = new URLSearchParams(params as Record<string, string>).toString();
      return this.request<{ data: unknown[]; total: number }>(`/v2/patients?${q}`);
    },
    get: (id: string) => this.request<unknown>(`/v2/patients/${id}`),
  };

  readonly appointments = {
    list: (patientId?: string) => {
      const q = patientId ? `?patientId=${patientId}` : '';
      return this.request<unknown[]>(`/v2/appointments${q}`);
    },
  };
}
