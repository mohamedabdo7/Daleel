// hooks/useProfileApi.ts

import { apiFetch } from "@/lib/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// =============================================================================
// TYPES
// =============================================================================

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  dailing_code: string;
  gender: "male" | "female";
  image: string;
  points: number;
  country: Country;
  city: City;
  area: Area | null;
  education: Education;
  specialty: Specialty;
}

export interface Country {
  id: number;
  title: string;
  slug: string;
  code: string;
  country_code: string;
}

export interface City {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export interface Area {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export interface Education {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export interface Specialty {
  id: number;
  title: string;
  slug: string;
  created_at: string;
}

export interface ProfileResponse {
  data: UserProfile;
  status: number;
  message: string;
}

export interface CountriesResponse {
  data: Country[];
  status: number;
  message: string;
}

export interface CitiesResponse {
  data: City[];
  status: number;
  message: string;
}

export interface AreasResponse {
  data: Area[];
  status: number;
  message: string;
}

export interface SpecialtiesResponse {
  data: Specialty[];
  status: number;
  message: string;
}

export interface EducationsResponse {
  data: Education[];
  status: number;
  message: string;
}

export interface UpdateProfilePayload {
  name: string;
  email: string;
  phone: string;
  dailing_code: string;
  specialty_id: number;
  education_id: number;
  country_id: number;
  city_id: number;
  area_id?: number;
  gender: "male" | "female";
}

// =============================================================================
// QUERIES
// =============================================================================

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiFetch<ProfileResponse>("/user/profile"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: () => apiFetch<CountriesResponse>("/user/countries"),
    staleTime: 60 * 60 * 1000, // 1 hour (countries don't change often)
  });
};

export const useCitiesByCountry = (countryId: number | null) => {
  return useQuery({
    queryKey: ["cities", countryId],
    queryFn: () =>
      apiFetch<CitiesResponse>(`/user/cities_by_country_id/${countryId}`),
    enabled: !!countryId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAreasByCity = (cityId: number | null) => {
  return useQuery({
    queryKey: ["areas", cityId],
    queryFn: () => apiFetch<AreasResponse>(`/user/areas_by_city_id/${cityId}`),
    enabled: !!cityId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSpecialties = () => {
  return useQuery({
    queryKey: ["specialties"],
    queryFn: () => apiFetch<SpecialtiesResponse>("/user/specialty"),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useEducations = () => {
  return useQuery({
    queryKey: ["educations"],
    queryFn: () => apiFetch<EducationsResponse>("/user/education"),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// =============================================================================
// MUTATIONS
// =============================================================================

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const formData = new FormData();

      // Append all fields to FormData
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      formData.append("phone", payload.phone);
      formData.append("dailing_code", payload.dailing_code);
      formData.append("specialty_id", String(payload.specialty_id));
      formData.append("education_id", String(payload.education_id));
      formData.append("country_id", String(payload.country_id));
      formData.append("city_id", String(payload.city_id));
      formData.append("gender", payload.gender);

      if (payload.area_id) {
        formData.append("area_id", String(payload.area_id));
      }

      return apiFetch<ProfileResponse>("/user/update_profile", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};
