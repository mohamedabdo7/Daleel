// types/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dailing_code: string;
  gender: string;
  image: string;
  points: number;
  country: {
    id: number;
    title: string;
    slug: string;
    code: string;
    country_code: string;
  };
  city: {
    id: number;
    title: string;
    slug: string;
    created_at: string;
  };
  area: any;
  education: {
    id: number;
    title: string;
    slug: string;
    created_at: string;
  };
  specialty: {
    id: number;
    title: string;
    slug: string;
    created_at: string;
  };
}

export interface LoginResponse {
  data: User & {
    token: string;
  };
  status: number;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}
