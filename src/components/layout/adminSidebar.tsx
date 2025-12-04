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

export default function AdminSidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
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

        {isAdmin && (
          <>
            <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.2)" }} />
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Wallets" />
            </ListItemButton>
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Criptomonedas" />
            </ListItemButton>
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Transacciones" />
            </ListItemButton>
            <ListItemButton component="a" href="/admin" sx={{ bgcolor: "rgba(0, 0, 0, 0.1)" }}>
              <ListItemText primary="Bloqueados" />
            </ListItemButton>
          </>
        )}
      </List>
    </Drawer>
  );
}
