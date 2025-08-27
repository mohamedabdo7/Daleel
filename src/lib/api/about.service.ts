// lib/api/about.service.ts
import { apiFetch } from "@/lib/api/client";

// === Types ===
export interface TeamMember {
  id: number;
  uuid: string;
  name: string;
  slug: string | null;
  position: string;
  about: string;
  file: string;
  image: string;
}

export interface CommitteeMember {
  id?: number;
  uuid?: string;
  name: string;
  slug?: string | null;
  position?: string;
  about?: string;
  file?: string;
  image: string;
  desc?: string;
}

export interface CommitteeSection {
  name: string;
  data: CommitteeMember[];
}

export interface AboutData {
  about: string; // HTML content
  team: TeamMember[];
  scientific_committee: CommitteeSection[];
  volunteers: CommitteeSection[];
}

export interface AboutResponse {
  status: number;
  messages: string;
  data: AboutData;
}

// === Services ===
export async function getAboutData(
  signal?: AbortSignal
): Promise<AboutData | null> {
  try {
    const res = await apiFetch<AboutResponse>("/user/about", {
      signal,
    });
    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch about data:", error);
    return null;
  }
}

// Helper functions for specific sections
export async function getTeamMembers(
  signal?: AbortSignal
): Promise<TeamMember[] | null> {
  try {
    const data = await getAboutData(signal);
    return data?.team ?? null;
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return null;
  }
}

export async function getScientificCommittees(
  signal?: AbortSignal
): Promise<CommitteeSection[] | null> {
  try {
    const data = await getAboutData(signal);
    return data?.scientific_committee ?? null;
  } catch (error) {
    console.error("Failed to fetch scientific committees:", error);
    return null;
  }
}

export async function getVolunteers(
  signal?: AbortSignal
): Promise<CommitteeSection[] | null> {
  try {
    const data = await getAboutData(signal);
    return data?.volunteers ?? null;
  } catch (error) {
    console.error("Failed to fetch volunteers:", error);
    return null;
  }
}
