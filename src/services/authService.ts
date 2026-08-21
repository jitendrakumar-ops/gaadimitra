import { AuthResponse, LoginCredentials, User } from '../types/auth';
import { validateIndianPhoneNumber, validatePassword } from '../utils/validation';

/**
 * Authentication Service
 * Currently runs a mock implementation for UI testing and prototyping.
 * To connect to real backend in the future:
 * - Replace mock resolution with `apiClient.post<AuthResponse>('/auth/login', credentials)`
 */
export class AuthService {
  /**
   * Mock login with mobile number and password
   */
  async loginWithPhone(credentials: LoginCredentials): Promise<AuthResponse> {
    const { phoneNumber, password, countryCode } = credentials;

    // Simulate async network request delay
    await new Promise<void>(resolve => setTimeout(() => resolve(), 800));

    // Client-side validation check
    const phoneValidation = validateIndianPhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      throw new Error(phoneValidation.error || 'Invalid phone number');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error || 'Invalid password');
    }

    // Real network request to public API for live network inspection
    let networkStatus = 'OK';
    try {
      const apiResponse = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber.replace(/\s+/g, ''),
          countryCode: countryCode || '+91',
          loginTime: new Date().toISOString(),
          app: 'GaadiMitra',
        }),
      });
      networkStatus = `HTTP ${apiResponse.status}`;
    } catch (e) {
      console.warn('Network request info:', e);
    }

    // Mock successful authentication response
    const mockUser: User = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: 'Rohan Sharma',
      phoneNumber: phoneNumber.replace(/\s+/g, ''),
      countryCode: countryCode || '+91',
      email: 'rohan.sharma@example.com',
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: `Login successful (${networkStatus})`,
      token: 'mock_jwt_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      user: mockUser,
    };
  }

  /**
   * Mock social login (Google/Apple)
   */
  async loginWithSocial(provider: 'google' | 'apple'): Promise<AuthResponse> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 600));

    const mockUser: User = {
      id: 'usr_social_' + Math.random().toString(36).substring(2, 9),
      name: provider === 'google' ? 'Google User' : 'Apple User',
      phoneNumber: '9876543210',
      countryCode: '+91',
      email: `${provider}.user@example.com`,
      role: 'buyer',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: `Signed in with ${provider.toUpperCase()}`,
      token: `mock_social_${provider}_token`,
      user: mockUser,
    };
  }

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
  }
}

export const authService = new AuthService();
