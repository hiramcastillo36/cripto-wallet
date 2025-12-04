import { authService } from './authService';

const API_URL = 'http://localhost:8000/api/v1/admin';

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin?: boolean;
  is_blocked?: boolean;
  blocked_reason?: string;
  blocked_at?: string;
  created_at?: string;
}

export interface BlockedUser extends User {
  blocked_reason: string;
  blocked_at: string;
}

export interface BlockUserData {
  user_id: number;
  reason: string;
}

export interface BlockUserResponse {
  success: boolean;
  message: string;
  data: {
    user: BlockedUser & {
      is_blocked: boolean;
    };
  };
}

export interface UnblockUserData {
  user_id: number;
}

export interface UnblockUserResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      is_blocked: boolean;
    };
  };
}

export interface BlockedUsersResponse {
  success: boolean;
  message: string;
  data: {
    users: BlockedUser[];
    count: number;
  };
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface UsersListResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: Pagination;
  };
}

export interface UserDetailsResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface Wallet {
  id: number;
  user_id: number;
  wallet_address: string;
  total_value_usd: string;
  is_active: number;
  frozen_at: string | null;
  frozen_reason: string | null;
  last_activity_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
    is_blocked?: boolean;
    blocked_reason?: string | null;
  };
}

export interface WalletDetailsResponse {
  success: boolean;
  message: string;
  data: {
    wallet: Wallet & {
      user: User;
      balances_count: number;
    };
  };
}

export interface WalletsListResponse {
  success: boolean;
  message: string;
  data: {
    wallets: Wallet[];
    pagination: Pagination;
  };
}

export interface FreezeWalletData {
  wallet_id: number;
  reason: string;
}

export interface FreezeWalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet: Wallet & {
      is_frozen: boolean;
      frozen_reason: string;
      frozen_at: string;
    };
  };
}

export interface UnfreezeWalletData {
  wallet_id: number;
}

export interface UnfreezeWalletResponse {
  success: boolean;
  message: string;
  data: {
    wallet: Wallet & {
      is_frozen: boolean;
    };
  };
}

export const adminService = {
  async blockUser(data: BlockUserData): Promise<BlockUserResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/users/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al bloquear usuario');
    }

    return response.json();
  },

  async unblockUser(data: UnblockUserData): Promise<UnblockUserResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/users/unblock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al desbloquear usuario');
    }

    return response.json();
  },

  async getBlockedUsers(): Promise<BlockedUsersResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/users/blocked`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener usuarios bloqueados');
    }

    return response.json();
  },

  async getUsers(params?: {
    search?: string;
    is_blocked?: boolean;
    is_admin?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<UsersListResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_blocked !== undefined) queryParams.append('is_blocked', String(params.is_blocked));
    if (params?.is_admin !== undefined) queryParams.append('is_admin', String(params.is_admin));
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_URL}/users?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener usuarios');
    }

    return response.json();
  },

  async getUserDetails(userId: number): Promise<UserDetailsResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener detalles del usuario');
    }

    return response.json();
  },

  async getWallets(params?: {
    search?: string;
    is_frozen?: boolean;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<WalletsListResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_frozen !== undefined) queryParams.append('is_frozen', String(params.is_frozen));
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_URL}/wallets?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener wallets');
    }

    return response.json();
  },

  async getWalletDetails(walletId: number): Promise<WalletDetailsResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/wallets/${walletId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener detalles de la wallet');
    }

    return response.json();
  },

  async freezeWallet(data: FreezeWalletData): Promise<FreezeWalletResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/wallets/freeze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al congelar wallet');
    }

    return response.json();
  },

  async unfreezeWallet(data: UnfreezeWalletData): Promise<UnfreezeWalletResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/wallets/unfreeze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al descongelar wallet');
    }

    return response.json();
  },
};
