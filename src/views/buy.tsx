import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { cryptoService, type Cryptocurrency } from "../services/cryptoService";
import { purchaseService } from "../services/purchaseService";
import { walletService, type Balance } from "../services/walletService";

export default function BuyAndSell() {
  const [mode, setMode] = useState("buy"); // buy | sell
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<number | null>(null);
  const [amountSpend, setAmountSpend] = useState("");
  const [amountReceive, setAmountReceive] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCryptocurrencies();
  }, []);

  useEffect(() => {
    // Calcular automáticamente el monto de criptomoneda a recibir
    const calculateAmount = async () => {
      if (!amountSpend || !selectedCrypto) {
        setAmountReceive("");
        return;
      }

      const selectedCryptoData = cryptocurrencies.find((c) => c.id === selectedCrypto);
      if (!selectedCryptoData) return;

      try {
        // Obtener el precio actual de Coinbase
        const currentPrice = await cryptoService.getCurrentPrice(selectedCryptoData.symbol);
        const amount = parseFloat(amountSpend);

        if (isNaN(amount) || amount <= 0) {
          setAmountReceive("");
          return;
        }

        let calculated: number;
        if (mode === "buy") {
          calculated = amount / currentPrice;
        } else {
          calculated = amount * currentPrice;
        }

        setAmountReceive(calculated.toFixed(mode === "buy" ? 8 : 2));
      } catch (err) {
        // Si hay error al obtener el precio, usar el precio cacheado como fallback
        const fallbackPrice = selectedCryptoData.price_usd;
        if (fallbackPrice) {
          const amount = parseFloat(amountSpend);
          let calculated: number;
          if (mode === "buy") {
            calculated = amount / fallbackPrice;
          } else {
            calculated = amount * fallbackPrice;
          }
          setAmountReceive(calculated.toFixed(mode === "buy" ? 8 : 2));
        }
      }
    };

    calculateAmount();
  }, [amountSpend, selectedCrypto, cryptocurrencies, mode]);

  const loadCryptocurrencies = async () => {
    try {
      setLoading(true);
      const [cryptoData, walletData] = await Promise.all([
        cryptoService.getCryptocurrencies(),
        walletService.getBalance(),
      ]);
      setCryptocurrencies(cryptoData);
      setBalances(walletData.balances);
      if (cryptoData.length > 0) {
        setSelectedCrypto(cryptoData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar criptomonedas');
    } finally {
      setLoading(false);
    }
  };

  const handleTransaction = async () => {
    if (!selectedCrypto || !amountSpend) {
      setError('Por favor completa todos los campos');
      return;
    }

    const amount = parseFloat(amountSpend);
    if (isNaN(amount) || amount <= 0) {
      setError('Por favor ingresa una cantidad válida mayor a 0');
      return;
    }

    const selectedCryptoData = cryptocurrencies.find((c) => c.id === selectedCrypto);
    if (!selectedCryptoData) {
      setError('Criptomoneda seleccionada inválida');
      return;
    }

    // Validar saldo disponible en modo venta
    if (mode === "sell") {
      const cryptoBalance = balances.find((b) => b.cryptocurrency_id === selectedCrypto);
      if (!cryptoBalance || cryptoBalance.available_balance < amount) {
        setError(`No tienes saldo suficiente. Disponible: ${cryptoBalance?.available_balance || 0} ${selectedCryptoData.symbol}`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccessMessage(null);

      // Obtener el precio actual de Coinbase
      const currentPrice = await cryptoService.getCurrentPrice(selectedCryptoData.symbol);

      if (mode === "buy") {
        // Compra: el usuario gasta USD y recibe crypto
        const cryptoAmount = amount / currentPrice;

        if (cryptoAmount <= 0) {
          setError('Error al calcular el monto de criptomoneda');
          return;
        }

        await purchaseService.createPurchase({
          cryptocurrency_id: selectedCrypto,
          amount_crypto: cryptoAmount,
          amount_usd: amount,
          payment_method: "credit_card",
        });

        setSuccessMessage(`Compra realizada exitosamente. Recibiste ${cryptoAmount.toFixed(8)} ${selectedCryptoData.symbol}`);
      } else {
        // Venta: el usuario gasta crypto y recibe USD
        const usdAmount = amount * currentPrice;

        if (usdAmount <= 0) {
          setError('Error al calcular el monto en USD');
          return;
        }

        await purchaseService.sellCrypto({
          cryptocurrency_id: selectedCrypto,
          amount_crypto: amount,
          price_usd: currentPrice,
        });

        setSuccessMessage(`Venta realizada exitosamente. Recibiste $${usdAmount.toFixed(2)} USD`);
      }

      setAmountSpend("");
      setAmountReceive("");
      // Recargar balances después de la transacción
      await loadCryptocurrencies();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Error al procesar la ${mode === "buy" ? "compra" : "venta"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Header />
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        {/* Contenido */}
        <Box
          sx={{
            flexGrow: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "center",
            paddingTop: 15,
          }}
        >
          {/* Mostrar errores y éxito */}
          {error && <Alert severity="error">{error}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}

          {/* Título */}
          <Typography variant="h3" sx={{ fontWeight: 700, color: "primary.main" }}>
            {mode === "buy" ? "Comprar Crypto con USD" : "Vender Crypto por USD"}
          </Typography>

          {/* CARD */}
          <Paper
            elevation={6}
            sx={{
              width: 420,
              backgroundColor: "info.main",
              p: 3,
              borderRadius: 4,
              background: "info.main",
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* TABS */}
            <Box sx={{ display: "flex", gap: 3, mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  pb: 1,
                  cursor: "pointer",
                  fontWeight: 600,
                  color: mode === "buy" ? "white" : "#555",
                  borderBottom: mode === "buy" ? "3px solid #003049" : "none",
                }}
                onClick={() => setMode("buy")}
              >
                Comprar
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  pb: 1,
                  cursor: "pointer",
                  fontWeight: 600,
                  color: mode === "sell" ? "white" : "#555",
                  borderBottom: mode === "sell" ? "3px solid #003049" : "none",
                }}
                onClick={() => setMode("sell")}
              >
                Vender
              </Typography>
            </Box>

            {/* Campo 1: Gastas / Vendes */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "primary.main",
                borderRadius: 3,
                border: "1px solid #333",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ color: "#888" }}>
                  {mode === "buy" ? "Gastas" : "Vendes"}
                </Typography>
                {mode === "sell" && selectedCrypto && (
                  <Typography sx={{ color: "#888", fontSize: "0.85rem" }}>
                    Disponible: {balances.find((b) => b.cryptocurrency_id === selectedCrypto)?.available_balance || 0} {cryptocurrencies.find((c) => c.id === selectedCrypto)?.symbol || ""}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  type="number"
                  value={amountSpend}
                  onChange={(e) => setAmountSpend(e.target.value)}
                  placeholder={mode === "buy" ? "85,614.97" : "1"}
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: {
                        fontSize: "1.5rem",
                        color: "white",
                      },
                    },
                  }}
                />

                {mode === "buy" ? (
                  <Box
                    sx={{
                      color: "white",
                      backgroundColor: "info.main",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    USD
                  </Box>
                ) : (
                  <TextField
                    select
                    variant="standard"
                    value={selectedCrypto || ""}
                    onChange={(e) => setSelectedCrypto(Number(e.target.value))}
                    slotProps={{
                      input: {
                        disableUnderline: true,
                        sx: {
                          color: "white",
                          backgroundColor: "info.main",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    {balances.map((balance) => (
                      <MenuItem key={balance.cryptocurrency_id} value={balance.cryptocurrency_id}>
                        {balance.symbol}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              </Box>
            </Box>

            {/* Campo 2: Recibes */}
            <Box
              sx={{
                p: 2,
                backgroundColor: "primary.main",
                borderRadius: 3,
                border: "1px solid #333",
              }}
            >
              <Typography sx={{ color: "#888", mb: 1 }}>
                Recibes
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  type="number"
                  value={amountReceive}
                  disabled
                  placeholder={mode === "buy" ? "0.00000000" : "0.00"}
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: {
                        fontSize: "1.5rem",
                        color: "white",
                      },
                    },
                  }}
                />

                {mode === "buy" ? (
                  <TextField
                    select
                    variant="standard"
                    value={selectedCrypto || ""}
                    onChange={(e) => setSelectedCrypto(Number(e.target.value))}
                    slotProps={{
                      input: {
                        disableUnderline: true,
                        sx: {
                          color: "white",
                          backgroundColor: "info.main",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          fontWeight: 600,
                        },
                      },
                    }}
                  >
                    {cryptocurrencies.map((crypto) => (
                      <MenuItem key={crypto.id} value={crypto.id}>
                        {crypto.symbol}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <Box
                    sx={{
                      color: "white",
                      backgroundColor: "info.main",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      fontWeight: 600,
                    }}
                  >
                    USD
                  </Box>
                )}
              </Box>
            </Box>

            {/* Botón */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleTransaction}
              disabled={isSubmitting}
              sx={{
                mt: 2,
                py: 2,
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "white",
                borderRadius: 2,
                backgroundColor: "secondary.main",
                "&:hover": {
                  backgroundColor: "#8A0D17",
                },
              }}
            >
              {isSubmitting ? "Procesando..." : (mode === "buy" ? "Comprar" : "Vender")}
            </Button>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
