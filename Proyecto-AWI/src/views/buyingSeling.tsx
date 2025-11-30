import { Container, Typography, Paper, Box, Button, TextField, InputAdornment, Alert } from "@mui/material";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import Card from "../components/card";

export default function Trade() {
  const sampleData = {
    price: "$45,876.12",
    volume: "$3.2B",
    change24h: "+2.3%",
    balance: {
      btc: "0.5234",
      usd: "12,450.00"
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <Container sx={{ py: 5 }}>
          {/* Título */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "error.main", mb: 4 }}
          >
            Comprar y Vender Bitcoin
          </Typography>

          {/* Estadísticas rápidas */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mb: 4,
            }}
          >
            <Box sx={{ flex: "1 1 200px" }}>
              <Card title="Precio actual">{sampleData.price}</Card>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Card title="Tu balance BTC">{sampleData.balance.btc} BTC</Card>
            </Box>
            <Box sx={{ flex: "1 1 200px" }}>
              <Card title="Tu balance USD">${sampleData.balance.usd}</Card>
            </Box>
          </Box>

          {/* Contenedor principal sin Grid */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mb: 4 }}>
            
            {/* Panel de Trading */}
            <Paper sx={{ p: 4, flex: "1 1 500px", minWidth: "300px" }}>
              <Typography variant="h5" sx={{ color: "primary.main", mb: 3, fontWeight: 600 }}>
                Realizar Operación
              </Typography>

              {/* Selector Compra/Venta */}
              <Box sx={{ display: "flex", mb: 3, gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{
                    flex: 1,
                    bgcolor: "success.main",
                    "&:hover": {
                      bgcolor: "success.dark",
                    }
                  }}
                >
                  Comprar
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    flex: 1,
                    color: "error.main",
                    borderColor: "error.main",
                  }}
                >
                  Vender
                </Button>
              </Box>

              {/* Formulario de Trading */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                  label="Cantidad BTC"
                  type="number"
                  defaultValue="0.1"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">BTC</InputAdornment>,
                  }}
                  fullWidth
                />

                <TextField
                  label="Precio por BTC"
                  type="number"
                  defaultValue="45876.12"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  fullWidth
                />

                <TextField
                  label="Total USD"
                  type="number"
                  defaultValue="4587.61"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  fullWidth
                />

                {/* Resumen de la operación */}
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography fontWeight="600">
                    Comprarás 0.1 BTC por $4,587.61
                  </Typography>
                </Alert>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    bgcolor: "success.main",
                    "&:hover": {
                      bgcolor: "success.dark",
                    }
                  }}
                >
                  Comprar Bitcoin
                </Button>
              </Box>
            </Paper>

            {/* Información del Mercado */}
            <Paper sx={{ p: 4, flex: "1 1 400px", minWidth: "300px" }}>
              <Typography variant="h5" sx={{ color: "primary.main", mb: 3, fontWeight: 600 }}>
                Información del Mercado
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography>Precio de mercado:</Typography>
                  <Typography fontWeight="600" color="primary.main">
                    ${sampleData.price}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography>Volumen 24h:</Typography>
                  <Typography fontWeight="600">
                    {sampleData.volume}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography>Cambio 24h:</Typography>
                  <Typography 
                    fontWeight="600" 
                    color={sampleData.change24h.startsWith("+") ? "success.main" : "error.main"}
                  >
                    {sampleData.change24h}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography>Tu balance BTC:</Typography>
                  <Typography fontWeight="600">
                    {sampleData.balance.btc} BTC
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography>Disponible para operar:</Typography>
                  <Typography fontWeight="600" color="secondary.main">
                    ${sampleData.balance.usd}
                  </Typography>
                </Box>
              </Box>

              {/* Consejos de Trading */}
              <Box sx={{ mt: 4, p: 2, bgcolor: "info.light", borderRadius: 1 }}>
                <Typography variant="h6" sx={{ color: "info.dark", mb: 1 }}>
                  💡 Consejos
                </Typography>
                <Typography variant="body2" sx={{ color: "info.dark" }}>
                  Considera comprar en pequeñas cantidades de forma regular (DCA) para promediar el precio de compra.
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Historial de Operaciones Recientes */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Operaciones Recientes
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                flex: "1 1 300px",
                borderLeft: "5px solid",
                borderColor: "success.main",
              }}
            >
              <Typography fontWeight="600">
                Compra — 0.005 BTC — $229.38
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Hace 5 minutos
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 300px",
                borderLeft: "5px solid",
                borderColor: "error.main",
              }}
            >
              <Typography fontWeight="600">
                Venta — 0.2 BTC — $9,175.22
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Hace 2 horas
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 300px",
                borderLeft: "5px solid",
                borderColor: "success.main",
              }}
            >
              <Typography fontWeight="600">
                Compra — 0.01 BTC — $458.76
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Hace 1 día
              </Typography>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}