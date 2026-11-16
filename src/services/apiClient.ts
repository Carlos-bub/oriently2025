import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

export interface ApiAuthProvider {
  getIdToken: () => string | null;
  refreshIdToken: () => Promise<string | null>;
  onUnauthorized: () => Promise<void> | void;
}

export class ApiError extends Error {
  status?: number;
  code: string;
  data?: Record<string, unknown>;

  constructor(
    message: string,
    code = "UNKNOWN",
    status?: number,
    data?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export function resolveBackendUrl(
  envUrl?: string,
  expoHostUri?: string
): string {
  const trimmed = envUrl?.trim();
  if (trimmed) {
    return trimmed.replace(/\/+$/, "");
  }

  // Em desenvolvimento com Expo no dispositivo físico, usa o IP do host do Metro
  if (expoHostUri) {
    const host = expoHostUri.split(":")[0]?.trim();
    if (host && host !== "localhost" && host !== "127.0.0.1") {
      return `http://${host}:3333`;
    }
  }

  return "";
}

export function mapHttpError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  const axiosError = error as AxiosError<{
    error?: string;
    code?: string;
    [key: string]: unknown;
  }>;
  const status = axiosError.response?.status;
  const responseData = axiosError.response?.data;
  const serverMessage = responseData?.error;
  const serverCode = responseData?.code;

  if (!axiosError.response) {
    if (axiosError.code === "ECONNABORTED") {
      return new ApiError(
        "Tempo limite excedido ao conectar ao servidor.",
        "TIMEOUT"
      );
    }
    return new ApiError(
      "Não foi possível conectar ao servidor do Oriently. Verifique sua rede.",
      "NETWORK_ERROR"
    );
  }

  if (status === 401) {
    return new ApiError(
      serverMessage || "Sessão expirada ou inválida. Faça login novamente.",
      serverCode || "UNAUTHORIZED",
      401
    );
  }

  if (status === 403) {
    return new ApiError(
      serverMessage || "Você não tem permissão para realizar esta ação.",
      serverCode || "FORBIDDEN",
      403
    );
  }

  if (status === 429) {
    return new ApiError(
      serverMessage || "Muitas requisições em pouco tempo. Aguarde um instante.",
      serverCode || "RATE_LIMIT",
      429
    );
  }

  return new ApiError(
    serverMessage || "Erro ao comunicar com o servidor.",
    serverCode || "SERVER_ERROR",
    status,
    responseData
  );
}

export function getFriendlyApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error instanceof ApiError) {
    if (error.code === "CONFIG_ERROR") {
      return "Servidor do aplicativo não configurado. Verifique EXPO_PUBLIC_BACKEND_URL.";
    }
    if (error.code === "UNAUTHORIZED" || error.status === 401) {
      return "Sua sessão expirou. Faça login novamente com o Google.";
    }
    if (error.code === "FORBIDDEN" || error.status === 403) {
      return "Você não tem permissão para acessar estes dados.";
    }
    if (error.code === "NETWORK_ERROR" || error.code === "TIMEOUT") {
      return "Sem conexão com o servidor. Verifique sua rede e tente novamente.";
    }
    if (error.code === "RATE_LIMIT" || error.status === 429) {
      return "Limite de requisições atingido. Aguarde alguns instantes.";
    }
    if (error.status && error.status >= 500) {
      return "O servidor está temporariamente indisponível. Tente novamente.";
    }
    return error.message || fallback;
  }

  return fallback;
}

export function createApiClient(
  baseURL: string,
  authRef: { current: ApiAuthProvider | null }
): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (!config.baseURL) {
      return Promise.reject(
        new ApiError(
          "EXPO_PUBLIC_BACKEND_URL não configurado.",
          "CONFIG_ERROR"
        )
      );
    }

    const token = authRef.current?.getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryableRequestConfig | undefined;
      const status = error.response?.status;

      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        authRef.current
      ) {
        originalRequest._retry = true;
        try {
          const newToken = await authRef.current.refreshIdToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client.request(originalRequest);
          }
        } catch {
          // Falha ao renovar token segue para logout
        }

        await authRef.current.onUnauthorized();
      }

      return Promise.reject(mapHttpError(error));
    }
  );

  return client;
}

const authProviderRef: { current: ApiAuthProvider | null } = {
  current: null,
};

export function configureApiAuth(provider: ApiAuthProvider | null): void {
  authProviderRef.current = provider;
}

export function getAuthProviderRef() {
  return authProviderRef;
}
