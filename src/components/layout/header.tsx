import { AppBar, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Evita superposición con el Drawer
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          Crypto Wallet
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
