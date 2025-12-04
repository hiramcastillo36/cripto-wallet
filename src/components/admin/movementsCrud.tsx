import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Chip,
  TablePagination,
} from "@mui/material";
import { useEffect, useState } from "react";
import { cryptoService, type TransactionDetail } from "../../services/cryptoService";

export default function TransaccionesCrud() {
  const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
  });

  const fetchTransactions = async (pageNum: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cryptoService.getAllTransactions({
        page: pageNum,
        per_page: rowsPerPage,
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        sort_by: "created_at",
        sort_order: "desc",
      });

      setTransactions(response.data.transactions);
      setTotalTransactions(response.data.total);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar transacciones";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page + 1);
  }, [page, rowsPerPage, filters]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
    setPage(0);
  };


  const getStatusColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      transfer: "Transferencia",
      market_sell: "Venta en Mercado",
      market_buy: "Compra en Mercado",
      send: "Envío",
      receive: "Recepción",
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Filtros */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Buscar"
          placeholder="Por usuario, dirección, etc."
          size="small"
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "rgba(255,255,255,0.5)",
              opacity: 1,
            },
          }}
        />
        <TextField
          select
          label="Estado"
          size="small"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            },
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="completed">Completadas</MenuItem>
          <MenuItem value="pending">Pendientes</MenuItem>
          <MenuItem value="failed">Fallidas</MenuItem>
        </TextField>
        <TextField
          select
          label="Tipo"
          size="small"
          value={filters.type}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          sx={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              color: "white",
              "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
              "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
            },
            "& .MuiSvgIcon-root": { color: "white" },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="send">Envíos</MenuItem>
          <MenuItem value="receive">Recepción</MenuItem>
        </TextField>
      </Box>

      {/* Mensaje de error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Tabla de transacciones */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>UUID</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>Tipo</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>De / Para</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>Moneda</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>Monto</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>USD</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>Estado</TableCell>
                  <TableCell sx={{ color: "info.main", fontWeight: 600 }}>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} hover>
                      <TableCell sx={{ color: "white" }}>{tx.id}</TableCell>
                      <TableCell sx={{ color: "white", fontSize: "0.8rem" }}>
                        {tx.uuid.substring(0, 8)}...
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        <Chip
                          label={getTypeLabel(tx.type)}
                          color={tx.type === "send" ? "error" : "success"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        <Typography variant="caption" display="block">
                          De: {tx.sender.name}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Para: {tx.receiver?.name || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {tx.cryptocurrency.symbol}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        {tx.amount} {tx.cryptocurrency.symbol}
                      </TableCell>
                      <TableCell sx={{ color: "white" }}>
                        ${tx.usd_value_at_time || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tx.status.toUpperCase()}
                          color={getStatusColor(tx.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "white", fontSize: "0.8rem" }}>
                        {formatDate(tx.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ color: "white", py: 4 }}>
                      No hay transacciones
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Paginación */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalTransactions}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: "white",
              "& .MuiTablePagination-select": { color: "white" },
              "& .MuiTablePagination-selectIcon": { color: "white" },
              "& .MuiIconButton-root": { color: "white" },
            }}
          />
        </>
      )}

    </>
  );
}
