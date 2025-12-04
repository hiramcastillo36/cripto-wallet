import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { authService } from "../../services/authService";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verificar si el usuario es admin
    const checkAdmin = () => {
      const isAdminUser = authService.isAdmin();
      setIsAdmin(isAdminUser);
    };

    checkAdmin();
  }, []);

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: 240,
          backgroundColor: "info.main",
          color: "white",
          borderRight: "none",
        },
      }}
      sx={{ width: 240, flexShrink: 0 }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Crypto Wallet
        </Typography>
      </Box>

      <List>
        <ListItemButton component="a" href="/">
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton component="a" href="/buying-selling">
          <ListItemText primary="Comprar/Vender" />
        </ListItemButton>

        <ListItemButton component="a" href="/wallet">
          <ListItemText primary="Wallet" />
        </ListItemButton>

        <ListItemButton component="a" href="/ajustes">
          <ListItemText primary="Ajustes" />
        </ListItemButton>

        {/* Opción de administración solo para admins */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.2)" }} />
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Administración" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
}
