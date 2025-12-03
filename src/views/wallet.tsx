import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import SendModal from "../components/modals/SendModal";
import ReceiveModal from "../components/modals/ReceiveModal";
import { walletService, type Balance, type Transaction } from "../services/walletService";

export default function Wallet() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      // Obtener balance
      const balanceData = await walletService.getBalance();
      setWalletAddress(balanceData.wallet_address);
      setBalances(balanceData.balances);

      // Obtener transacciones
      const transactionsData = await walletService.getTransactions(20, 0);
      setTransactions(transactionsData.transactions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar datos de la wallet";
      setError(errorMessage);
      console.error("Error fetching wallet data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleSendSuccess = async () => {
    setSuccessMessage("Transacción enviada exitosamente");
    setTimeout(() => setSuccessMessage(""), 3000);
    await fetchWalletData();
  };

  const handleReceiveSuccess = () => {
    setSuccessMessage("Modal de recepción cerrado");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const getPrimaryBalance = () => {
    return balances.find((b) => b.symbol === "BTC") || balances[0];
  };

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

  const calculateUsdValue = (transaction: Transaction) => {
    const sign = transaction.type === "receive" ? "+" : "-";
    return `${sign}$${Math.abs(transaction.usd_value).toFixed(2)}`;
  };

  const primaryBalance = getPrimaryBalance();

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Sidebar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <Container sx={{ py: 5 }}>
          {error && (
            <Box sx={{ mb: 3, p: 2, bgcolor: "error.light", borderRadius: 1 }}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}

          {/* Título */}
          <Typography variant="h4" fontWeight="bold" sx={{ color: "primary.main", mb: 4 }}>
            Wallet de {primaryBalance?.symbol || "Criptomonedas"}
          </Typography>

          {/* Balance principal */}
          {primaryBalance && (
            <Paper
              sx={{
                p: 4,
                mb: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                background: "linear-gradient(135deg, #003049, #012a40)",
                color: "white",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Balance total
              </Typography>

              <Typography variant="h3" fontWeight="bold">
                {primaryBalance.balance} {primaryBalance.symbol}
              </Typography>

              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                ≈ ${(parseFloat(primaryBalance.balance) * (primaryBalance.available_balance || 0)).toFixed(2)} USD
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setReceiveModalOpen(true)}
                  sx={{
                    flex: 1,
                    bgcolor: "success.main",
                    "&:hover": { bgcolor: "success.dark" },
                  }}
                >
                  Recibir
                </Button>

                <Button
                  variant="contained"
                  onClick={() => setSendModalOpen(true)}
                  sx={{
                    flex: 1,
                    bgcolor: "secondary.main",
                    "&:hover": { bgcolor: "secondary.dark" },
                  }}
                >
                  Enviar
                </Button>
              </Box>
            </Paper>
          )}

          {/* Wallet + QR */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mb: 5 }}>
            {/* Info */}
            <Paper sx={{ p: 4, flex: "1 1 350px" }}>
              <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                Detalles de la Wallet
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Dirección:</Typography>
                <Typography fontWeight="600" sx={{ wordBreak: "break-all", fontSize: "0.9rem" }}>
                  {walletAddress}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Criptomonedas:</Typography>
                <Typography fontWeight="600">{balances.length} monedas</Typography>
              </Box>

              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2, borderColor: "primary.main", color: "primary.main" }}
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress);
                }}
              >
                Copiar Dirección
              </Button>
            </Paper>

            {/* Resumen de Balances */}
            <Paper sx={{ p: 4, flex: "1 1 350px" }}>
              <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
                Resumen de Balances
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {balances.map((balance) => (
                  <Box key={balance.cryptocurrency_id} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="body2" fontWeight="500">
                      {balance.symbol}:
                    </Typography>
                    <Typography variant="body2" fontWeight="600">
                      {balance.balance}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Transacciones recientes */}
          <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 600, mb: 3 }}>
            Transacciones Recientes
          </Typography>

          {transactions.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography color="text.secondary">No hay transacciones registradas</Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {transactions.map((t) => (
                <Paper
                  key={t.id}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    borderLeft: "6px solid",
                    borderColor: t.type === "receive" ? "success.main" : "error.main",
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: t.type === "receive" ? "success.main" : "error.main",
                    }}
                  >
                    {t.type === "receive" ? "↓" : "↑"}
                  </Avatar>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight="600">
                      {t.type === "receive" ? "+" : "-"}
                      {t.amount} {t.symbol}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateUsdValue(t)} — {formatDate(t.created_at)}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
                      {t.status}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}

          {/* Mensaje de éxito */}
          {successMessage && (
            <Box
              sx={{
                position: "fixed",
                bottom: 2,
                right: 2,
                p: 2,
                bgcolor: "success.main",
                color: "white",
                borderRadius: 1,
                zIndex: 1300,
              }}
            >
              <Typography variant="body2">{successMessage}</Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* Modales */}
      <SendModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        balances={balances}
        onSuccess={handleSendSuccess}
      />
      <ReceiveModal
        open={receiveModalOpen}
        onClose={() => setReceiveModalOpen(false)}
        walletAddress={walletAddress}
        symbol={primaryBalance?.symbol || "Crypto"}
      />
    </Box>
  );
}
