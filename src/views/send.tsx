import { Container, Paper, Typography, TextField, Button, Box } from "@mui/material";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
export default function SendBitcoin() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
         
          <Sidebar />
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            <Header />
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: "background.default",
        }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 3, color: "primary.main", fontWeight: 700 }}
        >
          Enviar Bitcoin
        </Typography>
        
        {/* Cantidad Disponible */}
        <Typography variant="subtitle1" sx={{ mb: 2, color: "text.secondary" }}>
          Cantidad disponible: <strong>0.5234 BTC</strong> (≈ $12,450.00 USD)
        </Typography>
        {/* Dirección */}
        <TextField
          fullWidth
          label="Dirección del receptor"
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "info.main" },
              "&:hover fieldset": { borderColor: "primary.main" },
            },
          }}
        />

        {/* Cantidad */}
        <TextField
          fullWidth
          label="Cantidad (BTC)"
          type="number"
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "info.main" },
              "&:hover fieldset": { borderColor: "primary.main" },
            },
          }}
        />

        {/* Nota */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Nota (opcional)"
          variant="outlined"
          sx={{
            mb: 4,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "info.main" },
              "&:hover fieldset": { borderColor: "primary.main" },
            },
          }}
        />

        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              px: 5,
              py: 1.5,
              borderRadius: 2,
              "&:hover": { backgroundColor: "#002237" },
            }}
          >
            Enviar BTC
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>
</Box>
  );
}
