export type IQueryResponse = {
  isSuccess: boolean;
  error?: boolean;
  errorMessage?: string;
  statusCode?: number;
};
export const FAILED_QUERY_RESPONSE_BASE = {
  isSuccess: false,
  error: true,
};

export const SUCCESS_QUERY_RESPONSE_BASE = {
  isSuccess: true,
  error: false,
};

type IBaseFetchOptions = {
  headers: {
    "Content-Type": string;
  };
  credentials: RequestCredentials;
};
export const BASE_LOCAL_URL_PATH = "http://localhost:3000";

export const baseFetchOption: IBaseFetchOptions = {
  headers: {
    "Content-Type": "application/json",
  },
  credentials: "include",
};

export type FieldErrors = Partial<Record<string, string[]>>;
