import {
  Box,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";


export default function WalletsCrud() {
  type WalletItem = { id: number; usuario: string; balance: string };

  const [data, setData] = useState<WalletItem[]>([
    { id: 1, usuario: "Carlos", balance: "1.25 BTC" },
    { id: 2, usuario: "Ana", balance: "0.43 BTC" },
  ]);

  type ModalType = "add" | "edit" | "delete";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>("add");
  const [current, setCurrent] = useState<WalletItem>({ id: 0, usuario: "", balance: "" });

  const handleOpen = (type: ModalType, item: WalletItem | null = null) => {
    setModalType(type);
    setCurrent(item ?? { id: 0, usuario: "", balance: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    if (modalType === "add") setData([...data, { ...current, id: data.length + 1 }]);
    if (modalType === "edit") setData(data.map((w) => (w.id === current.id ? { ...current } : w)));
    if (modalType === "delete") setData(data.filter((w) => w.id !== current.id));
    handleClose();
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Wallets</Typography>
        <Button variant="contained" color="secondary" onClick={() => handleOpen("add")}>
          Agregar Wallet
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "info.main" }}>ID</TableCell>
            <TableCell sx={{ color: "info.main" }}>Usuario</TableCell>
            <TableCell sx={{ color: "info.main" }}>Balance</TableCell>
            <TableCell sx={{ color: "info.main" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((w) => (
            <TableRow key={w.id}>
              <TableCell sx={{ color: "white" }}>{w.id}</TableCell>
              <TableCell sx={{ color: "white" }}>{w.usuario}</TableCell>
              <TableCell sx={{ color: "white" }}>{w.balance}</TableCell>
              <TableCell>
                <Button size="small" color="info" onClick={() => handleOpen("edit", w)}>Editar</Button>
                <Button size="small" color="error" onClick={() => handleOpen("delete", w)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ p: 4, bgcolor: "background.paper", width: 400, mx: "auto", mt: 10, borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            {modalType === "add" && "Agregar Wallet"}
            {modalType === "edit" && "Editar Wallet"}
            {modalType === "delete" && "Eliminar Wallet"}
          </Typography>

          {modalType !== "delete" ? (
            <Stack spacing={2}>
              <TextField label="Usuario" value={current.usuario} onChange={(e) => setCurrent({ ...current, usuario: e.target.value })} fullWidth />
              <TextField label="Balance" value={current.balance} onChange={(e) => setCurrent({ ...current, balance: e.target.value })} fullWidth />
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
