import api from '../api/axios';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  User,
} from '../types/auth';

// Remove tokens created by older frontend releases. Authentication now uses
// only the HTTP-only cookie issued by the backend.
if (typeof window !== 'undefined') {
  localStorage.removeItem('mpumudde_access_token');
  delete api.defaults.headers.common.Authorization;
}

class AuthService {
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', loginDto);
    return data;
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    // Creating another user's account must not replace the director's session.
    const { data } = await api.post<RegisterResponse>('/auth/register', registerDto);
    return data;
  }

  async me(): Promise<User> {
    const { data } = await api.get<User>('/auth/me');
    return data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.patch<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}

export default new AuthService();
