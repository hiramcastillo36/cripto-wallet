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
} from "@mui/material";
import { useEffect, useState } from "react";
import { adminService, type BlockedUser } from "../../services/adminService";

export default function BlockedUsersList() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [unblockingUserId, setUnblockingUserId] = useState<number | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockUserId, setBlockUserId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await adminService.getBlockedUsers();
      setBlockedUsers(response.data.users);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar usuarios bloqueados";
      setError(errorMessage);
      console.error("Error fetching blocked users:", err);
    } finally {
      setLoading(false);
    }
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
      await fetchBlockedUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al bloquear usuario";
      setError(errorMessage);
      console.error("Error blocking user:", err);
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
      await fetchBlockedUsers();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al desbloquear usuario";
      setError(errorMessage);
      console.error("Error unblocking user:", err);
    } finally {
      setActionLoading(false);
      setUnblockingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Total de usuarios bloqueados: {blockedUsers.length}
      </Typography>

      {blockedUsers.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center", bgcolor: "rgba(255, 255, 255, 0.1)" }}>
          <Typography color="textSecondary">No hay usuarios bloqueados</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(0, 0, 0, 0.2)" }}>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Nombre</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Razón del bloqueo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Fecha de bloqueo</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }} align="right">
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blockedUsers.map((user) => (
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
                  <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {user.blocked_reason}
                  </TableCell>
                  <TableCell sx={{ color: "rgba(255, 255, 255, 0.8)" }}>
                    {formatDate(user.blocked_at)}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleUnblockUser(user.id)}
                      disabled={actionLoading && unblockingUserId === user.id}
                      sx={{ textTransform: "none" }}
                    >
                      {actionLoading && unblockingUserId === user.id ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Desbloquear"
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
