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

// -------------------------------
// TIPOS
// -------------------------------
type CryptoItem = {
  id: number;
  nombre: string;
  symbol: string;
};

type ModalType = "add" | "edit" | "delete";

// -------------------------------
// COMPONENTE PRINCIPAL
// -------------------------------
export default function CryptoCrud() {
  const [data, setData] = useState<CryptoItem[]>([
    { id: 1, nombre: "Bitcoin", symbol: "BTC" },
    { id: 2, nombre: "Ethereum", symbol: "ETH" },
  ]);

  const [open, setOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>("add");

  const [current, setCurrent] = useState<CryptoItem>({
    id: 0,
    nombre: "",
    symbol: "",
  });

  // -------------------------------
  // ABRIR MODAL
  // -------------------------------
  const handleOpen = (type: ModalType, item: CryptoItem | null = null) => {
    setModalType(type);
    setCurrent(item ?? { id: 0, nombre: "", symbol: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  // -------------------------------
  // GUARDAR CAMBIOS
  // -------------------------------
  const handleSave = () => {
    if (modalType === "add") {
      setData([
        ...data,
        {
          id: data.length + 1,
          nombre: current.nombre,
          symbol: current.symbol,
        },
      ]);
    }

    if (modalType === "edit") {
      setData(
        data.map((c) =>
          c.id === current.id
            ? {
                ...c,
                nombre: current.nombre,
                symbol: current.symbol,
              }
            : c
        )
      );
    }

    if (modalType === "delete") {
      setData(data.filter((c) => c.id !== current.id));
    }

    handleClose();
  };

  return (
    <>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h6">Criptomonedas</Typography>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpen("add")}
        >
          Agregar Criptomoneda
        </Button>
      </Box>

      {/* TABLA */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "background.default" }}>ID</TableCell>
            <TableCell sx={{ color: "background.default" }}>Nombre</TableCell>
            <TableCell sx={{ color: "background.default" }}>Símbolo</TableCell>
            <TableCell sx={{ color: "background.default" }}>Acciones</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((c) => (
            <TableRow key={c.id}>
              <TableCell sx={{ color: "white" }}>{c.id}</TableCell>
              <TableCell sx={{ color: "white" }}>{c.nombre}</TableCell>
              <TableCell sx={{ color: "white" }}>{c.symbol}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  color="info"
                  onClick={() => handleOpen("edit", c)}
                >
                  Editar
                </Button>

                <Button
                  size="small"
                  color="error"
                  onClick={() => handleOpen("delete", c)}
                >
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* MODAL */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            width: 400,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            {modalType === "add" && "Agregar Criptomoneda"}
            {modalType === "edit" && "Editar Criptomoneda"}
            {modalType === "delete" && "Eliminar Criptomoneda"}
          </Typography>

          {modalType !== "delete" ? (
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={current.nombre}
                onChange={(e) =>
                  setCurrent({ ...current, nombre: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Símbolo"
                value={current.symbol}
                onChange={(e) =>
                  setCurrent({ ...current, symbol: e.target.value })
                }
                fullWidth
              />
            </Stack>
          ) : (
            <Typography>
              ¿Seguro que deseas eliminar{" "}
              <strong>{current.nombre}</strong>?
            </Typography>
          )}

          {/* BOTONES DEL MODAL */}
          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button onClick={handleClose}>Cancelar</Button>

            <Button
              variant="contained"
              color={
                modalType === "delete"
                  ? "error"
                  : modalType === "edit"
                  ? "info"
                  : "secondary"
              }
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
