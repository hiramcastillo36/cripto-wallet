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
import { adminService, type User, type UsersListResponse } from "../../services/adminService";

export default function AllUsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [filterBlocked, setFilterBlocked] = useState<boolean | null>(null);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [blockUserId, setBlockUserId] = useState<number | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [unblockingUserId, setUnblockingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, perPage, search, filterBlocked]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getUsers({
        search: search || undefined,
        is_blocked: filterBlocked !== null ? filterBlocked : undefined,
        per_page: perPage,
        page: page + 1,
      });
      setUsers(response.data.users);
      setTotalUsers(response.data.pagination.total);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar usuarios";
      setError(errorMessage);
      console.error("Error fetching users:", err);
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

  const handleOpenBlockDialog = (userId: number) => {
    setBlockUserId(userId);
    setBlockReason("");
    setBlockDialogOpen(true);
  };

  const handleCloseBlockDialog = () => {
    setBlockDialogOpen(false);
    setBlockUserId(null);
    setBlockReason("");
  };

  const handleBlockUser = async () => {
    if (!blockUserId || !blockReason.trim()) {
      setError("Debes ingresar una razón para bloquear");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      await adminService.blockUser({
        user_id: blockUserId,
        reason: blockReason.trim(),
      });
      handleCloseBlockDialog();
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al bloquear usuario";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblockUser = async (userId: number) => {
    try {
      setActionLoading(true);
      setUnblockingUserId(userId);
      setError("");
      await adminService.unblockUser({ user_id: userId });
      await fetchUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al desbloquear usuario";
      setError(errorMessage);
    } finally {
      setActionLoading(false);
      setUnblockingUserId(null);
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

  if (loading && users.length === 0) {
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
          placeholder="Buscar por nombre o email..."
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
          variant={filterBlocked === null ? "outlined" : "contained"}
          onClick={() => setFilterBlocked(null)}
          sx={{ minWidth: 120 }}
        >
          Todos
        </Button>
        <Button
          variant={filterBlocked === false ? "contained" : "outlined"}
          onClick={() => setFilterBlocked(false)}
          sx={{ minWidth: 120 }}
        >
          Activos
        </Button>
        <Button
          variant={filterBlocked === true ? "contained" : "outlined"}
          color="error"
          onClick={() => setFilterBlocked(true)}
          sx={{ minWidth: 120 }}
        >
          Bloqueados
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Total de usuarios: {totalUsers}
      </Typography>

      {users.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.1)" }}>
          <Typography color="textSecondary">No hay usuarios</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Rol</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Estado</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Fecha de registro</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.08)" },
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <TableCell sx={{ color: "white" }}>{user.id}</TableCell>
                  <TableCell sx={{ color: "white" }}>{user.name}</TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>{user.email}</TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Chip label="Admin" size="small" color="error" />
                    ) : (
                      <Chip label="Usuario" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {user.is_blocked ? (
                      <Chip label="Bloqueado" size="small" color="error" variant="outlined" />
                    ) : (
                      <Chip label="Activo" size="small" color="success" variant="outlined" />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                      {user.is_blocked ? (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleUnblockUser(user.id)}
                          disabled={actionLoading && unblockingUserId === user.id}
                        >
                          {actionLoading && unblockingUserId === user.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            "Desbloquear"
                          )}
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenBlockDialog(user.id)}
                        >
                          Bloquear
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
            count={totalUsers}
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

      {/* Dialog para bloquear usuario */}
      <Dialog open={blockDialogOpen} onClose={handleCloseBlockDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Bloquear Usuario</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Razón del bloqueo"
            multiline
            rows={3}
            value={blockReason}
            onChange={(e) => setBlockReason(e.target.value)}
            placeholder="Ingresa la razón por la cual deseas bloquear este usuario"
            disabled={actionLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBlockDialog} disabled={actionLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleBlockUser}
            variant="contained"
            color="error"
            disabled={actionLoading || !blockReason.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : "Bloquear"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
