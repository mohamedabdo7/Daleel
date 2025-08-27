// lib/api/policy.service.ts
import { apiFetch } from "@/lib/api/client";

// === Types ===
export interface PolicyData {
  id: number;
  key: string;
  value: string; // HTML content
  active: number;
  file?: string | null;
  admin_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface PolicyResponse {
  status: number;
  data: {
    privacy_policy: PolicyData;
  };
  message: string;
}

// === Services ===
export async function getPrivacyPolicy(
  signal?: AbortSignal
): Promise<PolicyResponse["data"] | null> {
  try {
    const res = await apiFetch<PolicyResponse>("/user/policy", {
      signal,
    });
    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch privacy policy:", error);
    return null;
  }
}

// If you need other policy types in the future
export async function getTermsOfService(
  signal?: AbortSignal
): Promise<PolicyData | null> {
  try {
    const res = await apiFetch<{ data: PolicyData }>("/user/terms", {
      signal,
    });
    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch terms of service:", error);
    return null;
  }
}
