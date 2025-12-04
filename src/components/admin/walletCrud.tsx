import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  TablePagination,
  Chip,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { adminService, type Wallet } from "../../services/adminService";

export default function WalletsCrud() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalWallets, setTotalWallets] = useState(0);
  const [search, setSearch] = useState("");
  const [filterFrozen, setFilterFrozen] = useState<boolean | null>(null);
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);
  const [freezeWalletId, setFreezeWalletId] = useState<number | null>(null);
  const [freezeReason, setFreezeReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [unfreezingWalletId, setUnfreezingWalletId] = useState<number | null>(null);

  useEffect(() => {
    fetchWallets();
  }, [page, perPage, search, filterFrozen]);

  const fetchWallets = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getWallets({
        search: search || undefined,
        is_frozen: filterFrozen !== null ? filterFrozen : undefined,
        per_page: perPage,
        page: page + 1,
      });
      setWallets(response.data.wallets);
      setTotalWallets(response.data.pagination.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar wallets";
      setError(errorMessage);
      console.error("Error fetching wallets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleOpenFreezeDialog = (walletId: number) => {
    setFreezeWalletId(walletId);
    setFreezeReason("");
    setFreezeDialogOpen(true);
  };

  const handleCloseFreezeDialog = () => {
    setFreezeDialogOpen(false);
    setFreezeWalletId(null);
    setFreezeReason("");
  };

  const handleFreezeWallet = async () => {
    if (!freezeWalletId || !freezeReason.trim()) {
      setError("Debes ingresar una razón para congelar");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      await adminService.freezeWallet({
        wallet_id: freezeWalletId,
        reason: freezeReason.trim(),
      });
      handleCloseFreezeDialog();
      await fetchWallets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al congelar wallet";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfreezeWallet = async (walletId: number) => {
    try {
      setActionLoading(true);
      setUnfreezingWalletId(walletId);
      setError("");
      await adminService.unfreezeWallet({ wallet_id: walletId });
      await fetchWallets();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al descongelar wallet";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
      setUnfreezingWalletId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading && wallets.length === 0) {
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

      {/* Barra de búsqueda */}
      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          placeholder="Buscar por dirección..."
          value={search}
          onChange={handleSearchChange}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          }}
        />
        <Button
          variant={filterFrozen === null ? "outlined" : "contained"}
          onClick={() => setFilterFrozen(null)}
          sx={{ minWidth: 120 }}
        >
          Todas
        </Button>
        <Button
          variant={filterFrozen === false ? "contained" : "outlined"}
          onClick={() => setFilterFrozen(false)}
          sx={{ minWidth: 120 }}
        >
          Activas
        </Button>
        <Button
          variant={filterFrozen === true ? "contained" : "outlined"}
          color="error"
          onClick={() => setFilterFrozen(true)}
          sx={{ minWidth: 120 }}
        >
          Congeladas
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Total de wallets: {totalWallets}
      </Typography>

      {wallets.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.1)" }}>
          <Typography color="textSecondary">No hay wallets</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Dirección</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Usuario</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Razón</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Fecha de creación</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {wallets.map((wallet) => (
                <TableRow
                  key={wallet.id}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{wallet.id}</TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)", fontFamily: "monospace", fontSize: "0.85rem" }}>
                    {wallet.wallet_address.substring(0, 16)}...
                  </TableCell>
                  <TableCell sx={{ color: "white" }}>
                    {wallet.user?.name || "-"}
                  </TableCell>
                  <TableCell>
                    {wallet.frozen_at ? (
                      <Chip label="Congelada" size="small" color="error" variant="outlined" />
                    ) : (
                      <Chip label="Activa" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {wallet.frozen_reason || "-"}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {formatDate(wallet.created_at)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      {wallet.frozen_at ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleUnfreezeWallet(wallet.id)}
                          disabled={actionLoading && unfreezingWalletId === wallet.id}
                        >
                          {actionLoading && unfreezingWalletId === wallet.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Descongelar"
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenFreezeDialog(wallet.id)}
                        >
                          Congelar
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalWallets}
            rowsPerPage={perPage}
            page={page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.1)",
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "white",
              },
              "& .MuiIconButton-root": {
                color: "white",
              },
            }}
          />
        </TableContainer>
      )}

      {/* Dialog para congelar wallet */}
      <Dialog open={freezeDialogOpen} onClose={handleCloseFreezeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Congelar Wallet</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Razón del congelamiento"
            multiline
            rows={3}
            value={freezeReason}
            onChange={(e) => setFreezeReason(e.target.value)}
            placeholder="Ingresa la razón por la cual deseas congelar esta wallet"
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFreezeDialog} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleFreezeWallet}
            variant="contained"
            color="error"
            disabled={actionLoading || !freezeReason.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : "Congelar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
