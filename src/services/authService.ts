const API_URL = 'http://localhost:8000/api/v1/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user?: User;
}

interface APIAuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      is_admin?: boolean;
    };
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export const authService = {
  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el login');
    }

    const data: APIAuthResponse = await response.json();

    return {
      access_token: data.data.token,
      user: data.data.user,
    };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en el registro');
    }

    const apiData: APIAuthResponse = await response.json();

    return {
      access_token: apiData.data.token,
      user: apiData.data.user,
    };
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  setToken(token: string) {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async validateToken(): Promise<boolean> {
    try {
      const token = this.getToken();

      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Si el token es inválido, limpiarlo
        this.logout();
        return false;
      }

      // Actualizar información del usuario con datos del backend
      const data = await response.json();
      if (data.data?.user) {
        this.setUser(data.data.user);
      }

      return true;
    } catch (error) {
      console.error('Error validating token:', error);
      this.logout();
      return false;
    }
  },

  isAdmin(): boolean {
    try {
      const user = this.getUser();

      return user?.is_admin === true || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },

  async validateAdmin(): Promise<boolean> {
    try {
      const isValid = await this.validateToken();
      if (!isValid) {
        return false;
      }

      return this.isAdmin();
    } catch (error) {
      console.error('Error validating admin:', error);
      return false;
    }
  },
};
