import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { walletService, type Balance, type SendData } from "../../services/walletService";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
  balances: Balance[];
  onSuccess: () => void;
}

export default function SendModal({ open, onClose, balances, onSuccess }: SendModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<number>(balances[0]?.cryptocurrency_id || 0);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedBalance = balances.find((b) => b.cryptocurrency_id === selectedCrypto);

  const handleSend = async () => {
    try {
      setError("");

      // Validaciones
      if (!selectedCrypto) {
        setError("Selecciona una criptomoneda");
        return;
      }

      if (!toAddress.trim()) {
        setError("Ingresa la dirección de destino");
        return;
      }

      if (!amount || parseFloat(amount) <= 0) {
        setError("Ingresa un monto válido");
        return;
      }

      const amountNum = parseFloat(amount);
      const availableBalance = parseFloat(selectedBalance?.available_balance.toString() || "0");

      if (amountNum > availableBalance) {
        setError(`No tienes suficiente balance. Disponible: ${availableBalance} ${selectedBalance?.symbol}`);
        return;
      }

      setLoading(true);

      const sendData: SendData = {
        cryptocurrency_id: selectedCrypto,
        amount_crypto: amountNum,
        to_address: toAddress.trim(),
      };

      await walletService.send(sendData);

      // Limpiar formulario
      setToAddress("");
      setAmount("");
      setError("");

      // Cerrar modal
      onClose();

      // Notificar éxito
      onSuccess();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al enviar";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setToAddress("");
      setAmount("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Enviar Criptomonedas
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {/* Seleccionar criptomoneda */}
          <FormControl fullWidth>
            <InputLabel>Criptomoneda</InputLabel>
            <Select
              value={selectedCrypto}
              label="Criptomoneda"
              onChange={(e) => setSelectedCrypto(e.target.value as number)}
              disabled={loading}
            >
              {balances.map((balance) => (
                <MenuItem key={balance.cryptocurrency_id} value={balance.cryptocurrency_id}>
                  {balance.symbol} - {balance.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Balance disponible */}
          {selectedBalance && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Balance disponible
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {selectedBalance.available_balance} {selectedBalance.symbol}
              </Typography>
            </Box>
          )}

          {/* Dirección de destino */}
          <TextField
            fullWidth
            label="Dirección de destino"
            placeholder="Ingresa la dirección de wallet"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            disabled={loading}
            multiline
            rows={3}
            sx={{ fontFamily: "monospace" }}
          />

          {/* Monto */}
          <TextField
            fullWidth
            label="Monto"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            inputProps={{
              step: "0.00000001",
              min: "0",
            }}
            endAdornment={
              selectedBalance && (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  {selectedBalance.symbol}
                </Typography>
              )
            }
          />

          {/* Botón de max */}
          {selectedBalance && (
            <Button
              size="small"
              variant="text"
              onClick={() => setAmount(selectedBalance.available_balance.toString())}
              disabled={loading}
              sx={{ alignSelf: "flex-start" }}
            >
              Usar máximo: {selectedBalance.available_balance} {selectedBalance.symbol}
            </Button>
          )}

          {/* Advertencia */}
          <Box sx={{ p: 2, bgcolor: "warning.lighter", borderRadius: 1 }}>
            <Typography variant="caption" color="warning.main">
              <strong>Advertencia:</strong> Verifica la dirección de destino antes de enviar. Las transacciones no se pueden
              revertir.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          color="error"
          disabled={loading || !toAddress.trim() || !amount}
          sx={{ display: "flex", gap: 1 }}
        >
          {loading && <CircularProgress size={20} color="inherit" />}
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
