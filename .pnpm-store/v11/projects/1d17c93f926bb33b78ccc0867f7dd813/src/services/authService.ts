import api from '../api/axios';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  User,
} from '../types/auth';

const ACCESS_TOKEN_KEY = 'mpumudde_access_token';

function setClientToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

if (typeof window !== 'undefined') {
  const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (storedToken) setClientToken(storedToken);
}

class AuthService {
  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', loginDto);
    localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
    setClientToken(data.access_token);
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
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      setClientToken();
    }
  }
}

export default new AuthService();
