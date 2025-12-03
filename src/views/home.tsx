import { Container, Typography, Paper, Box, CircularProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import Card from "../components/card";
import CryptoTable from "../components/cryptoTable";
import { walletService, type Transaction } from "../services/walletService";

export default function Home() {
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState("");

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      try {
        setLoadingTransactions(true);
        setErrorTransactions("");
        const data = await walletService.getLatestTransactions(5);
        setLatestTransactions(data.transactions);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar transacciones";
        setErrorTransactions(errorMessage);
        console.error("Error fetching latest transactions:", err);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchLatestTransactions();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffDays < 30) return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;

    return date.toLocaleDateString("es-ES");
  };

  const getUsdValue = (transaction: Transaction) => {
    if (transaction.usd_value !== null) {
      return `$${Math.abs(transaction.usd_value).toFixed(2)}`;
    }
    return "N/A";
  };

  const sampleData = {
    price: "$45,876.12",
    volume: "$3.2B",
    change24h: "+2.3%",
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <Container sx={{ py: 5 }}>
          {/* Título */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "error.main", mb: 4 }}
          >
            Resumen General
          </Typography>

          {/* Tabla */}
          <CryptoTable />

          {/* Últimos movimientos */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Últimos movimientos
          </Typography>

          {errorTransactions && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorTransactions}
            </Alert>
          )}

          {loadingTransactions ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : latestTransactions.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">No hay transacciones recientes</Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              {latestTransactions.map((transaction) => (
                <Paper
                  key={transaction.id}
                  sx={{
                    p: 3,
                    flex: "1 1 300px",
                    borderLeft: "5px solid",
                    borderColor: transaction.type === "receive" ? "success.main" : "warning.main",
                  }}
                >
                  <Typography fontWeight="600">
                    {transaction.type === "receive" ? "Recibido" : "Enviado"} — {transaction.amount} {transaction.cryptocurrency.symbol}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {formatDate(transaction.completed_at)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          {/* Tendencias del mercado */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Tendencias del mercado
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                flex: "1 1 250px",
                bgcolor: "info.main",
                color: "white",
              }}
            >
              <Typography variant="h6">BTC Dominance</Typography>
              <Typography variant="h4" fontWeight="bold">
                48.3%
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 250px",
                bgcolor: "secondary.main",
                color: "white",
              }}
            >
              <Typography variant="h6">Fear & Greed Index</Typography>
              <Typography variant="h4" fontWeight="bold">
                72 — Greed
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 250px",
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <Typography variant="h6">Volatilidad semanal</Typography>
              <Typography variant="h4" fontWeight="bold">
                +5.7%
              </Typography>
            </Paper>
          </Box>

          {/* Noticias */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Noticias recientes
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                ETF de Bitcoin alcanza récord histórico
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 1 hora
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                Ballenas acumulan 3,200 BTC
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 3 horas
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                Mineros aumentan reservas antes del halving
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 5 horas
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
