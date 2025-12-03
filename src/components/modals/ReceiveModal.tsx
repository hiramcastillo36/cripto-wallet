import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ReceiveModalProps {
  open: boolean;
  onClose: () => void;
  walletAddress: string;
  symbol: string;
}

export default function ReceiveModal({ open, onClose, walletAddress, symbol }: ReceiveModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Recibir {symbol}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Instrucciones */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Comparte tu dirección de wallet para recibir {symbol}. Solo acepta transacciones de {symbol} en esta dirección.
            </Typography>
          </Box>

          {/* Dirección */}
          <Paper
            sx={{
              p: 2,
              bgcolor: "grey.50",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
              Dirección de wallet
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  wordBreak: "break-all",
                  flex: 1,
                  fontSize: "0.85rem",
                }}
              >
                {walletAddress}
              </Typography>
              <IconButton
                size="small"
                onClick={handleCopy}
                sx={{ flexShrink: 0 }}
                title={copied ? "Copiado!" : "Copiar"}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>

          {/* Estado de copia */}
          {copied && (
            <Typography
              variant="caption"
              sx={{ color: "success.main", fontWeight: 500, textAlign: "center" }}
            >
              ✓ Dirección copiada al portapapeles
            </Typography>
          )}

          {/* Notas */}
          <Box sx={{ bgcolor: "info.lighter", p: 2, borderRadius: 1 }}>
            <Typography variant="caption" color="info.main">
              <strong>Nota:</strong> Las transacciones pueden tardar algunos minutos en confirmarse.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" fullWidth sx={{ bgcolor: "primary.main" }}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
