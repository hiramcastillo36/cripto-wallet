import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab
} from "@mui/material";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import AllUsersList from "../components/admin/allUsersList";
import WalletsCrud from "../components/admin/walletCrud";
import CryptoCrud from "../components/admin/cryptoCrud";
import TransaccionesCrud from "../components/admin/movementsCrud";
import BlockedUsersList from "../components/admin/blockedUsersList";

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        {/* Contenido */}
        <Box sx={{ p: 4 , paddingTop: 15}}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "primary.main" }}>
            Panel de Administración
          </Typography>

          {/* TABS */}
          <Paper
  elevation={4}
  sx={{
    justifyContent: "center",
    borderRadius: 3,
    mb: 4,
    backgroundColor: "primary.main",
    p: 1,
  }}
>
  <Tabs
    value={tab}
    onChange={(_, v) => setTab(v)}
    TabIndicatorProps={{ style: { display: "none" } }} // Ocultar línea inferior
    sx={{ display: "flex", flexWrap: "wrap" }}
  >
    <Tab
      label="Usuarios"
      sx={{
        flex: 1,
        color: "white",
        fontWeight: 600,
        borderRadius: 2,
        mx: 1,
        minWidth: 120,
        bgcolor: tab === 0 ? "info.main" : "primary.main",
        "&:hover": {
          bgcolor: "info.main",
        }
      }}
    />
    <Tab
      label="Wallets"
      sx={{
        flex: 1,
        color: "white",
        fontWeight: 600,
        borderRadius: 2,
        mx: 1,
        minWidth: 120,
        bgcolor: tab === 1 ? "info.main" : "primary.main",
        "&:hover": {
          bgcolor: "info.main",
        }
      }}
    />
    <Tab
      label="Criptomonedas"
      sx={{
        flex: 1,
        color: "white",
        fontWeight: 600,
        borderRadius: 2,
        mx: 1,
        minWidth: 120,
        bgcolor: tab === 2 ? "info.main" : "primary.main",
        "&:hover": {
          bgcolor: "info.main",
        }
      }}
    />
    <Tab
      label="Transacciones"
      sx={{
        flex: 1,
        color: "white",
        fontWeight: 600,
        borderRadius: 2,
        mx: 1,
        minWidth: 120,
        bgcolor: tab === 3 ? "info.main" : "primary.main",
        "&:hover": {
          bgcolor: "info.main",
        }
      }}
    />
    <Tab
      label="Bloqueados"
      sx={{
        flex: 1,
        color: "white",
        fontWeight: 600,
        borderRadius: 2,
        mx: 1,
        minWidth: 120,
        bgcolor: tab === 4 ? "error.main" : "primary.main",
        "&:hover": {
          bgcolor: "error.main",
        }
      }}
    />
  </Tabs>
</Paper>


          {/* CONTENIDO DEL CRUD */}
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              p: 3,
              backgroundColor: "primary.main",
              color: "white",
            }}
          >
            {tab === 0 && <AllUsersList />}
            {tab === 1 && <WalletsCrud />}
            {tab === 2 && <CryptoCrud />}
            {tab === 3 && <TransaccionesCrud />}
            {tab === 4 && <BlockedUsersList />}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
