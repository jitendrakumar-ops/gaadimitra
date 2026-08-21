export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  email?: string;
  role: 'buyer' | 'seller' | 'dealer' | 'admin';
  avatarUrl?: string;
  createdAt: string;
}

export interface LoginCredentials {
  countryCode: string;
  phoneNumber: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: User;
}

export interface ValidationError {
  phoneNumber?: string;
  password?: string;
  general?: string;
}
