import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";

export default function Sidebar() {
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

        <ListItemButton component="a" href="/admin">
          <ListItemText primary="Administración" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
