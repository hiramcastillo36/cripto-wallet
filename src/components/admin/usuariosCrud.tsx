
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

export default function UsuariosCrud() {
  type UserItem = { id: number; nombre: string; email: string; rol: string };

  const [data, setData] = useState<UserItem[]>([
    { id: 1, nombre: "Carlos", email: "carlos@mail.com", rol: "Admin" },
    { id: 2, nombre: "Ana", email: "ana@mail.com", rol: "Usuario" },
  ]);

  type ModalType = "add" | "edit" | "delete";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [current, setCurrent] = useState<UserItem>({ id: 0, nombre: "", email: "", rol: "Usuario" });

  const handleOpen = (type: ModalType, item: UserItem | null = null) => {
    setModalType(type);
    setCurrent(item ?? { id: 0, nombre: "", email: "", rol: "Usuario" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (modalType === "add") {
      setData([...data, { ...current, id: data.length + 1 }]);
    }

    if (modalType === "edit") {
      setData(data.map((u) => (u.id === current.id ? { ...current } : u)));
    }

    if (modalType === "delete") {
      setData(data.filter((u) => u.id !== current.id));
    }

    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Usuarios</Typography>
        <Button variant="contained" color="secondary" onClick={() => handleOpen("add")}>
          Agregar Usuario
        </Button>
      </Box>

      <Table sx={{ color: "white" }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "info.main" }}>ID</TableCell>
            <TableCell sx={{ color: "info.main" }}>Nombre</TableCell>
            <TableCell sx={{ color: "info.main" }}>Email</TableCell>
            <TableCell sx={{ color: "info.main" }}>Rol</TableCell>
            <TableCell sx={{ color: "info.main" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((u) => (
            <TableRow key={u.id}>
              <TableCell sx={{ color: "white" }}>{u.id}</TableCell>
              <TableCell sx={{ color: "white" }}>{u.nombre}</TableCell>
              <TableCell sx={{ color: "white" }}>{u.email}</TableCell>
              <TableCell sx={{ color: "white" }}>{u.rol}</TableCell>
              <TableCell>
                <Button size="small" color="info" onClick={() => handleOpen("edit", u)}>Editar</Button>
                <Button size="small" color="error" onClick={() => handleOpen("delete", u)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: "background.paper", width: 400, mx: "auto", mt: 10, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            {modalType === "add" && "Agregar Usuario"}
            {modalType === "edit" && "Editar Usuario"}
            {modalType === "delete" && "Eliminar Usuario"}
          </Typography>

          {modalType !== "delete" ? (
            <Stack spacing={2}>
              <TextField label="Nombre" value={current.nombre} onChange={(e) => setCurrent({ ...current, nombre: e.target.value })} fullWidth />
              <TextField label="Email" value={current.email} onChange={(e) => setCurrent({ ...current, email: e.target.value })} fullWidth />
              <TextField select label="Rol" value={current.rol} onChange={(e) => setCurrent({ ...current, rol: e.target.value })} fullWidth>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Usuario">Usuario</MenuItem>
              </TextField>
            </Stack>
          ) : (
            <Typography>
              ¿Seguro que deseas eliminar <strong>{current.nombre}</strong>?
            </Typography>
          )}

          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              variant="contained"
              color={modalType === "delete" ? "error" : modalType === "edit" ? "info" : "secondary"}
              onClick={handleSave}
            >
              {modalType === "add" && "Guardar"}
              {modalType === "edit" && "Actualizar"}
              {modalType === "delete" && "Eliminar"}
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
