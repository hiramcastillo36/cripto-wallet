import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

import CryptoRow from "./cryptoRow";
import { cryptoService } from "../services/cryptoService";

interface CryptoData {
  name: string;
  symbol: string;
  price: string;
}

export default function CryptoTable() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cryptos = [
    { name: "Bitcoin", symbol: "BTC" },
    { name: "Ethereum", symbol: "ETH" },
    { name: "Solana", symbol: "SOL" },
    { name: "Cardano", symbol: "ADA" },
  ];

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await Promise.all(
          cryptos.map(async (crypto) => {
            const marketData = await cryptoService.getMarketData(crypto.symbol);
            return {
              name: crypto.name,
              symbol: crypto.symbol,
              price: new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(marketData.price),
            };
          })
        );

        setCryptoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        // Fallback a datos de demostración
        setCryptoData([
          {
            name: "Bitcoin",
            symbol: "BTC",
            price: "$67,320",
          },
          {
            name: "Ethereum",
            symbol: "ETH",
            price: "$3,245",
          },
          {
            name: "Solana",
            symbol: "SOL",
            price: "$180",
          },
          {
            name: "Cardano",
            symbol: "ADA",
            price: "$0.95",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCryptoData();

    // Actualizar datos cada 60 segundos
    const interval = setInterval(fetchCryptoData, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "warning.main",
        backdropFilter: "blur(6px)",
        p: 2,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "error.main" }}>
        Cryptocurrencies
      </Typography>

      {error && (
        <Typography sx={{ mb: 2, color: "warning.main", fontSize: "0.9rem" }}>
          Usando datos en caché (Última actualización disponible)
        </Typography>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Nombre</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Símbolo</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Precio</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cryptoData.map((crypto) => (
            <CryptoRow key={crypto.symbol} {...crypto} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
