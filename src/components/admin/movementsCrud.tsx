import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Modal, TextField, Stack, MenuItem } from "@mui/material";
import { useState } from "react";
export default function TransaccionesCrud() {
  type Movement = { id: number; usuario: string; monto: string; tipo: string };

  const [data, setData] = useState<Movement[]>([
    { id: 1, usuario: "Carlos", monto: "0.5 BTC", tipo: "Compra" },
    { id: 2, usuario: "Ana", monto: "200 USD", tipo: "Venta" },
  ]);

  type ModalType = "add" | "edit" | "delete";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [current, setCurrent] = useState<Movement>({ id: 0, usuario: "", monto: "", tipo: "Compra" });

  const handleOpen = (type: ModalType, item: Movement | null = null) => {
    setModalType(type);
    setCurrent(item ?? { id: 0, usuario: "", monto: "", tipo: "Compra" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (modalType === "add") setData([...data, { ...current, id: data.length + 1 }]);
    if (modalType === "edit") setData(data.map((m) => (m.id === current.id ? { ...current } : m)));
    if (modalType === "delete") setData(data.filter((m) => m.id !== current.id));
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Transacciones</Typography>
        <Button variant="contained" color="secondary" onClick={() => handleOpen("add")}>
          Registrar Transacción
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "info.main" }}>ID</TableCell>
            <TableCell sx={{ color: "info.main" }}>Usuario</TableCell>
            <TableCell sx={{ color: "info.main" }}>Monto</TableCell>
            <TableCell sx={{ color: "info.main" }}>Tipo</TableCell>
            <TableCell sx={{ color: "info.main" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((t) => (
            <TableRow key={t.id}>
              <TableCell sx={{ color: "white" }}>{t.id}</TableCell>
              <TableCell sx={{ color: "white" }}>{t.usuario}</TableCell>
              <TableCell sx={{ color: "white" }}>{t.monto}</TableCell>
              <TableCell sx={{ color: "white" }}>{t.tipo}</TableCell>
              <TableCell>
                <Button size="small" color="info" onClick={() => handleOpen("edit", t)}>Editar</Button>
                <Button size="small" color="error" onClick={() => handleOpen("delete", t)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: "background.paper", width: 400, mx: "auto", mt: 10, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            {modalType === "add" && "Registrar Transacción"}
            {modalType === "edit" && "Editar Transacción"}
            {modalType === "delete" && "Eliminar Transacción"}
          </Typography>

          {modalType !== "delete" ? (
            <Stack spacing={2}>
              <TextField label="Usuario" value={current.usuario} onChange={(e) => setCurrent({ ...current, usuario: e.target.value })} fullWidth />
              <TextField label="Monto" value={current.monto} onChange={(e) => setCurrent({ ...current, monto: e.target.value })} fullWidth />
              <TextField select label="Tipo" value={current.tipo} onChange={(e) => setCurrent({ ...current, tipo: e.target.value })} fullWidth>
                <MenuItem value="Compra">Compra</MenuItem>
                <MenuItem value="Venta">Venta</MenuItem>
              </TextField>
            </Stack>
          ) : (
            <Typography>¿Seguro que deseas eliminar <strong>{current.usuario}</strong>?</Typography>
          )}

          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button onClick={handleClose}>Cancelar</Button>
            <Button variant="contained" color={modalType === "delete" ? "error" : modalType === "edit" ? "info" : "secondary"} onClick={handleSave}>
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
