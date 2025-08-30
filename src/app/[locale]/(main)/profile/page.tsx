"use client";

import * as React from "react";

import {
  useProfile,
  useCountries,
  useCitiesByCountry,
  useAreasByCity,
  useSpecialties,
  useEducations,
  useUpdateProfile,
  UpdateProfilePayload,
} from "./components/useProfileApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CustomInput } from "@/app/components/common/form/CustomInput";
import { PhoneInputComponent } from "@/app/components/common/form/CustomPhoneInput";
import { CustomSelect } from "@/app/components/common/form/CustomSelect";

interface FormData {
  name: string;
  email: string;
  phone: string;
  dailing_code: string;
  gender: "male" | "female";
  specialty_id: string; // Changed to string
  education_id: string; // Changed to string
  country_id: string; // Changed to string
  city_id: string; // Changed to string
  area_id: string; // Changed to string
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  specialty_id?: string;
  education_id?: string;
  country_id?: string;
  city_id?: string;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function ProfilePage() {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    phone: "",
    dailing_code: "+20",
    gender: "male",
    specialty_id: "",
    education_id: "",
    country_id: "",
    city_id: "",
    area_id: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});

  // API Hooks
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();
  const { data: countriesData, isLoading: countriesLoading } = useCountries();
  const { data: specialtiesData, isLoading: specialtiesLoading } =
    useSpecialties();
  const { data: educationsData, isLoading: educationsLoading } =
    useEducations();
  const { data: citiesData, isLoading: citiesLoading } = useCitiesByCountry(
    formData.country_id ? parseInt(formData.country_id) : null
  );
  const { data: areasData, isLoading: areasLoading } = useAreasByCity(
    formData.city_id ? parseInt(formData.city_id) : null
  );

  const updateProfileMutation = useUpdateProfile();

  // Populate form data when profile loads
  React.useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dailing_code: profile.dailing_code || "+20",
        gender: profile.gender || "male",
        specialty_id: profile.specialty?.id
          ? profile.specialty.id.toString()
          : "",
        education_id: profile.education?.id
          ? profile.education.id.toString()
          : "",
        country_id: profile.country?.id ? profile.country.id.toString() : "",
        city_id: profile.city?.id ? profile.city.id.toString() : "",
        area_id: profile.area?.id ? profile.area.id.toString() : "",
      });
    }
  }, [profileData]);

  // Reset city and area when country changes
  React.useEffect(() => {
    if (formData.country_id) {
      setFormData((prev) => ({
        ...prev,
        city_id: "",
        area_id: "",
      }));
    }
  }, [formData.country_id]);

  // Reset area when city changes
  React.useEffect(() => {
    if (formData.city_id) {
      setFormData((prev) => ({
        ...prev,
        area_id: "",
      }));
    }
  }, [formData.city_id]);

  const handleInputChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePhoneChange = (value: string | undefined, country: any) => {
    const phoneNumber = value || "";
    // Extract the phone number without country code
    const phone = phoneNumber.replace(/^\+\d+\s*/, "");
    const dialingCode = country?.countryCallingCode
      ? `+${country.countryCallingCode}`
      : "+20";

    setFormData((prev) => ({
      ...prev,
      phone: phone,
      dailing_code: dialingCode,
    }));

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required";
    }

    if (!formData.specialty_id) {
      newErrors.specialty_id = "Profession is required";
    }

    if (!formData.education_id) {
      newErrors.education_id = "Classification is required";
    }

    if (!formData.country_id) {
      newErrors.country_id = "Country is required";
    }

    if (!formData.city_id) {
      newErrors.city_id = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload: UpdateProfilePayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dailing_code: formData.dailing_code,
        specialty_id: Number(formData.specialty_id),
        education_id: Number(formData.education_id),
        country_id: Number(formData.country_id),
        city_id: Number(formData.city_id),
        gender: formData.gender,
        ...(formData.area_id && { area_id: Number(formData.area_id) }),
      };

      await updateProfileMutation.mutateAsync(payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load profile</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare options for selects - Convert numbers to strings
  const countryOptions =
    countriesData?.data?.map((country) => ({
      value: country.id.toString(),
      label: country.title,
    })) || [];

  const cityOptions =
    citiesData?.data?.map((city) => ({
      value: city.id.toString(),
      label: city.title,
    })) || [];

  const areaOptions =
    areasData?.data?.map((area) => ({
      value: area.id.toString(),
      label: area.title,
    })) || [];

  const specialtyOptions =
    specialtiesData?.data?.map((specialty) => ({
      value: specialty.id.toString(),
      label: specialty.title,
    })) || [];

  const educationOptions =
    educationsData?.data?.map((education) => ({
      value: education.id.toString(),
      label: education.title,
    })) || [];

  // Construct full phone number for display
  const fullPhoneNumber = formData.phone
    ? `${formData.dailing_code}${formData.phone}`
    : "";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Profile Settings
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name and Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomInput
                label="Name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
              />

              <PhoneInputComponent
                label="Mobile Number"
                placeholder="Type Mobile Number"
                value={fullPhoneNumber}
                onChange={handlePhoneChange}
                error={errors.phone}
                defaultCountry={formData.country_id === "1" ? "SA" : "EG"}
              />
            </div>

            {/* Row 2: Email and Gender */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                error={errors.email}
              />

              <CustomSelect
                label="Gender"
                placeholder="Select Gender"
                value={formData.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
                options={GENDER_OPTIONS}
                error={errors.gender}
              />
            </div>

            {/* Row 3: Profession and Classification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomSelect
                label="Profession"
                placeholder="Select Profession"
                value={formData.specialty_id}
                onValueChange={(value) =>
                  handleInputChange("specialty_id", value)
                }
                options={specialtyOptions}
                loading={specialtiesLoading}
                error={errors.specialty_id}
              />

              <CustomSelect
                label="Classification"
                placeholder="Select Classification"
                value={formData.education_id}
                onValueChange={(value) =>
                  handleInputChange("education_id", value)
                }
                options={educationOptions}
                loading={educationsLoading}
                error={errors.education_id}
              />
            </div>

            {/* Row 4: Country and City */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CustomSelect
                label="Country"
                placeholder="Select Country"
                value={formData.country_id}
                onValueChange={(value) =>
                  handleInputChange("country_id", value)
                }
                options={countryOptions}
                loading={countriesLoading}
                error={errors.country_id}
              />

              <CustomSelect
                label="City"
                placeholder="Select City"
                value={formData.city_id}
                onValueChange={(value) => handleInputChange("city_id", value)}
                options={cityOptions}
                loading={citiesLoading}
                disabled={!formData.country_id}
                error={errors.city_id}
              />
            </div>

            {/* Optional: Area (if needed) */}
            {formData.city_id && areaOptions.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CustomSelect
                  label="Area (Optional)"
                  placeholder="Select Area"
                  value={formData.area_id}
                  onValueChange={(value) => handleInputChange("area_id", value)}
                  options={areaOptions}
                  loading={areasLoading}
                />
                <div></div> {/* Empty div for grid alignment */}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {updateProfileMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating Profile...
                  </span>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
