import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { cryptoService, type Cryptocurrency, type CreateCryptocurrencyData } from "../../services/cryptoService";

// -------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------
export default function CryptoCrud() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateCryptocurrencyData>({
    symbol: "",
    name: "",
    coinbase_id: "",
    decimals: 8,
    description: "",
    min_purchase_amount: "",
    max_purchase_amount: "",
    purchase_fee_percentage: "",
    withdrawal_fee_percentage: "",
    market_trading_enabled: false,
    is_active: true,
  });

  useEffect(() => {
    fetchCryptocurrencies();
  }, []);

  const fetchCryptocurrencies = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await cryptoService.getCryptocurrencies();

      setCryptocurrencies(response);

      console.log("Fetched cryptocurrencies:", response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar criptomonedas";
      setError(errorMessage);
      console.error("Error fetching cryptocurrencies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      symbol: "",
      name: "",
      coinbase_id: "",
      decimals: 8,
      description: "",
      min_purchase_amount: "",
      max_purchase_amount: "",
      purchase_fee_percentage: "",
      withdrawal_fee_percentage: "",
      market_trading_enabled: false,
      is_active: true,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleCreateCryptocurrency = async () => {
    if (!formData.symbol.trim() || !formData.name.trim() || !formData.coinbase_id.trim()) {
      setError("Symbol, Name y Coinbase ID son requeridos");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      // Filter out empty optional fields
      const cleanData = {
        ...formData,
        description: formData.description?.trim() || undefined,
        min_purchase_amount: formData.min_purchase_amount?.trim() || undefined,
        max_purchase_amount: formData.max_purchase_amount?.trim() || undefined,
        purchase_fee_percentage: formData.purchase_fee_percentage?.trim() || undefined,
        withdrawal_fee_percentage: formData.withdrawal_fee_percentage?.trim() || undefined,
      };

      await cryptoService.createCryptocurrency(cleanData);
      handleCloseModal();
      await fetchCryptocurrencies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al crear criptomoneda";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCryptocurrency = async (cryptoId: number) => {
    try {
      setActionLoading(true);
      setDeletingId(cryptoId);
      setError("");
      await cryptoService.deleteCryptocurrency(cryptoId);
      await fetchCryptocurrencies();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al eliminar criptomoneda";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Total de criptomonedas: {cryptocurrencies.length}
        </Typography>
        <Button variant="contained" color="secondary" onClick={handleOpenModal}>
          Agregar Criptomoneda
        </Button>
      </Box>

      {cryptocurrencies.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.1)" }}>
          <Typography color="textSecondary">No hay criptomonedas</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Símbolo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Decimales</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Comisión Compra</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Comisión Retiro</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cryptocurrencies.map((crypto) => (
                <TableRow
                  key={crypto.id}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{crypto.id}</TableCell>
                  <TableCell sx={{ color: "white" }}>{crypto.name}</TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)", fontWeight: 600 }}>
                    {crypto.symbol}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {crypto.decimals}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {crypto.purchase_fee_percentage}%
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {crypto.withdrawal_fee_percentage}%
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteCryptocurrency(crypto.id)}
                      disabled={actionLoading && deletingId === crypto.id}
                    >
                      {actionLoading && deletingId === crypto.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Eliminar"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal para crear criptomoneda */}
      <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>Agregar Nueva Criptomoneda</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Símbolo *"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
              placeholder="ej: BTC"
              disabled={actionLoading}
            />
            <TextField
              label="Nombre *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej: Bitcoin"
              disabled={actionLoading}
            />
            <TextField
              label="Coinbase ID *"
              value={formData.coinbase_id}
              onChange={(e) => setFormData({ ...formData, coinbase_id: e.target.value })}
              placeholder="ej: BTC"
              disabled={actionLoading}
            />
            <TextField
              label="Decimales"
              type="number"
              value={formData.decimals}
              onChange={(e) => setFormData({ ...formData, decimals: parseInt(e.target.value) })}
              inputProps={{ min: 0, max: 18 }}
              disabled={actionLoading}
            />
            <TextField
              label="Descripción"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={actionLoading}
            />
            <TextField
              label="Monto Mínimo de Compra"
              value={formData.min_purchase_amount}
              onChange={(e) => setFormData({ ...formData, min_purchase_amount: e.target.value })}
              disabled={actionLoading}
            />
            <TextField
              label="Monto Máximo de Compra"
              value={formData.max_purchase_amount}
              onChange={(e) => setFormData({ ...formData, max_purchase_amount: e.target.value })}
              disabled={actionLoading}
            />
            <TextField
              label="Porcentaje Comisión Compra (%)"
              type="number"
              value={formData.purchase_fee_percentage}
              onChange={(e) => setFormData({ ...formData, purchase_fee_percentage: e.target.value })}
              disabled={actionLoading}
            />
            <TextField
              label="Porcentaje Comisión Retiro (%)"
              type="number"
              value={formData.withdrawal_fee_percentage}
              onChange={(e) => setFormData({ ...formData, withdrawal_fee_percentage: e.target.value })}
              disabled={actionLoading}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleCreateCryptocurrency}
            variant="contained"
            color="secondary"
            disabled={actionLoading || !formData.symbol.trim() || !formData.name.trim() || !formData.coinbase_id.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
