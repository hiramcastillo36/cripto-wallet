import { authService } from './authService';

const API_URL = 'https://cripto-wallet-api-main-7dnzxk.laravel.cloud/api/v1/wallet';

export interface Balance {
  cryptocurrency_id: number;
  symbol: string;
  name: string;
  balance: string;
  locked_balance: string;
  available_balance: number;
  last_transaction_at: string | null;
}

export interface WalletBalance {
  message: string;
  wallet_address: string;
  balances: Balance[];
  total_balance_count: number;
}

export interface SellData {
  cryptocurrency_id: number;
  amount_crypto: number;
  price_usd: number;
}

export interface SellResponse {
  id: number;
  cryptocurrency_id: number;
  amount_crypto: number;
  price_usd: number;
  total_usd: number;
  status: string;
  created_at: string;
}

export interface CryptoInfo {
  id: number;
  symbol: string;
  name: string;
}

export interface Transaction {
  id: number;
  type: "send" | "receive";
  cryptocurrency: CryptoInfo;
  amount: string;
  usd_value: number | null;
  from: string;
  to: string;
  status: "completed" | "pending" | "failed";
  completed_at: string;
}

export interface TransactionsResponse {
  message: string;
  transactions: Transaction[];
  total_count?: number;
  count?: number;
}

export interface SendData {
  cryptocurrency_id: number;
  amount_crypto: number;
  to_address: string;
}

export interface SendResponse {
  id: number;
  cryptocurrency_id: number;
  amount_crypto: number;
  to_address: string;
  status: string;
  transaction_hash?: string;
  created_at: string;
}

export const walletService = {
  async getBalance(): Promise<WalletBalance> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/balance`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener el balance');
    }

    return response.json();
  },

  async getTransactions(limit: number = 10, offset: number = 0): Promise<TransactionsResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(`${API_URL}/transactions?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener transacciones');
    }

    return response.json();
  },

  async send(data: SendData): Promise<SendResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/send`, {
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
      throw new Error(error.message || 'Error al enviar criptomonedas');
    }

    return response.json();
  },

  async getLatestTransactions(limit: number = 5): Promise<TransactionsResponse> {
    const response = await fetch(`https://cripto-wallet-api-main-7dnzxk.laravel.cloud/api/v1/transactions/latest?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener transacciones recientes');
    }

    return response.json();
  },

  async sell(data: SellData): Promise<SellResponse> {
    const token = authService.getToken();

    if (!token) {
      throw new Error('No estás autenticado');
    }

    const response = await fetch(`${API_URL}/sell`, {
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
      throw new Error(error.message || 'Error al procesar la venta');
    }

    return response.json();
  },
};
