const API_URL = 'http://localhost:8000/api/v1';
const COINBASE_API_URL = 'https://api.coinbase.com/v2';

export interface Cryptocurrency {
  id: number;
  name: string;
  symbol: string;
  price_usd?: number;
  description?: string;
  decimals?: number;
  min_purchase_amount?: string;
  max_purchase_amount?: string;
  purchase_fee_percentage?: string;
  withdrawal_fee_percentage?: string;
  market_trading_enabled?: boolean;
  coinbase_id?: string;
  is_active?: boolean;
}

export interface CreateCryptocurrencyData {
  symbol: string;
  name: string;
  coinbase_id: string;
  decimals: number;
  description?: string;
  min_purchase_amount?: string;
  max_purchase_amount?: string;
  purchase_fee_percentage?: string;
  withdrawal_fee_percentage?: string;
  market_trading_enabled?: boolean;
  is_active?: boolean;
}

export interface CreateCryptocurrencyResponse {
  success: boolean;
  message: string;
  data: {
    cryptocurrency: Cryptocurrency;
  };
}

export interface DeleteCryptocurrencyResponse {
  success: boolean;
  message: string;
}

interface CoinbasePrice {
  data: {
    amount: string;
    currency: string;
  };
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

export interface TransactionDetail {
  id: number;
  uuid: string;
  type: string;
  sender: UserInfo;
  receiver: UserInfo | null;
  cryptocurrency: Cryptocurrency;
  amount: string;
  fee_amount: string;
  usd_value_at_time: string | null;
  status: "completed" | "pending" | "failed";
  status_reason: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Pagination {
  total: number;
  count?: number;
  per_page?: number;
  current_page?: number;
  last_page?: number;
}

export interface GetAllTransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: TransactionDetail[];
    total: number;
    pagination?: Pagination;
  };
}

export const cryptoService = {
  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    const response = await fetch(`${API_URL}/cryptocurrencies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener criptomonedas');
    }

    const data = await response.json();

    return data.data.cryptocurrencies;
  },

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await fetch(`${COINBASE_API_URL}/prices/${symbol}-USD/buy`);

      if (!response.ok) {
        throw new Error(`Error al obtener precio de ${symbol}`);
      }

      const data: CoinbasePrice = await response.json();
      return parseFloat(data.data.amount);
    } catch (err) {
      throw new Error(`No se pudo obtener el precio actual de ${symbol}`);
    }
  },

  async getMarketData(symbol: string): Promise<{
    price: number;
    change24h: number;
    marketCap: string;
  }> {
    try {
      // Obtener precio actual de Coinbase
      const priceResponse = await fetch(`${COINBASE_API_URL}/prices/${symbol}-USD/buy`);

      if (!priceResponse.ok) {
        throw new Error(`Error al obtener precio de ${symbol}`);
      }

      const priceData: CoinbasePrice = await priceResponse.json();
      const price = parseFloat(priceData.data.amount);

      // Obtener datos de producto (incluye cambio 24h y volumen)
      const productId = `${symbol}-USD`;
      const productResponse = await fetch(
        `https://api.exchange.coinbase.com/products/${productId}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      let change24h = 0;
      let marketCap = 'N/A';

      if (productResponse.ok) {
        const productData = await productResponse.json();
        // Calcular el cambio 24h si está disponible
        if (productData.open_24h && productData.last) {
          change24h = ((productData.last - productData.open_24h) / productData.open_24h) * 100;
        }
      }

      return {
        price,
        change24h: parseFloat(change24h.toFixed(2)),
        marketCap,
      };
    } catch (err) {
      console.error(`Error obteniendo datos de mercado para ${symbol}:`, err);
      // Retornar valores por defecto en caso de error
      return {
        price: 0,
        change24h: 0,
        marketCap: 'N/A',
      };
    }
  },

  async createCryptocurrency(data: CreateCryptocurrencyData): Promise<CreateCryptocurrencyResponse> {
    const response = await fetch(`${API_URL}/cryptocurrencies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear criptomoneda');
    }

    return response.json();
  },

  async deleteCryptocurrency(cryptocurrencyId: number): Promise<DeleteCryptocurrencyResponse> {
    const response = await fetch(`${API_URL}/cryptocurrencies/${cryptocurrencyId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar criptomoneda');
    }

    return response.json();
  },

  async getAllTransactions(params?: {
    search?: string;
    status?: string;
    type?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    per_page?: number;
    page?: number;
  }): Promise<GetAllTransactionsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.per_page) queryParams.append('per_page', String(params.per_page));
    if (params?.page) queryParams.append('page', String(params.page));

    const response = await fetch(`${API_URL}/transactions?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener transacciones');
    }

    return response.json();
  },
};
