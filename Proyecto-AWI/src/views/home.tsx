import { Container, Typography, Paper, Box } from "@mui/material";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import Card from "../components/card";
import CryptoTable from "../components/cryptoTable";

export default function Home() {
  const sampleData = {
    price: "$45,876.12",
    volume: "$3.2B",
    change24h: "+2.3%",
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
            Resumen General
          </Typography>

          {/* Tabla */}
          <CryptoTable />

          {/* Tarjetas principales */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              mt: 4,
            }}
          >
            <Box sx={{ flex: "1 1 250px" }}>
              <Card title="Precio actual">{sampleData.price}</Card>
            </Box>

            <Box sx={{ flex: "1 1 250px" }}>
              <Card title="Volumen (24h)">{sampleData.volume}</Card>
            </Box>

            <Box sx={{ flex: "1 1 250px" }}>
              <Card title="Cambio (24h)">{sampleData.change24h}</Card>
            </Box>
          </Box>

          {/* Últimos movimientos */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Últimos movimientos
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
                borderColor: "secondary.main",
              }}
            >
              <Typography fontWeight="600">
                Movimiento 1 — Compra — 0.005 BTC
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
                borderColor: "warning.main",
              }}
            >
              <Typography fontWeight="600">
                Movimiento 2 — Venta — 0.2 BTC
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Hace 2 horas
              </Typography>
            </Paper>
          </Box>

          {/* Tendencias del mercado */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Tendencias del mercado
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
                flex: "1 1 250px",
                bgcolor: "info.main",
                color: "white",
              }}
            >
              <Typography variant="h6">BTC Dominance</Typography>
              <Typography variant="h4" fontWeight="bold">
                48.3%
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 250px",
                bgcolor: "secondary.main",
                color: "white",
              }}
            >
              <Typography variant="h6">Fear & Greed Index</Typography>
              <Typography variant="h4" fontWeight="bold">
                72 — Greed
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                flex: "1 1 250px",
                bgcolor: "primary.main",
                color: "white",
              }}
            >
              <Typography variant="h6">Volatilidad semanal</Typography>
              <Typography variant="h4" fontWeight="bold">
                +5.7%
              </Typography>
            </Paper>
          </Box>

          {/* Noticias */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Noticias recientes
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                ETF de Bitcoin alcanza récord histórico
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 1 hora
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                Ballenas acumulan 3,200 BTC
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 3 horas
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, flex: "1 1 300px" }}>
              <Typography fontWeight="600">
                Mineros aumentan reservas antes del halving
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hace 5 horas
              </Typography>
            </Paper>
          </Box>

          {/* Gráfico Placeholder */}
          <Typography
            variant="h5"
            sx={{ color: "primary.main", fontWeight: 600, mt: 6, mb: 3 }}
          >
            Gráfico de Bitcoin
          </Typography>

          <Paper
            sx={{
              p: 4,
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "info.main",
            }}
          >
            <Typography color="info.main">
              Aquí irá el gráfico (sin lógica todavía)
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
