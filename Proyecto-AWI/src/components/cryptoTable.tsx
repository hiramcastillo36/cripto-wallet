import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";

import CryptoRow from "./cryptoRow";

export default function CryptoTable() {
  const demoData = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "67,320",
      change24h: "1.84",
      marketCap: "1.3T",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      price: "3,245",
      change24h: "-0.82",
      marketCap: "380B",
    },
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "warning.main",
        backdropFilter: "blur(6px)",
        p: 2,
        borderRadius: 3,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: "error.main" }}>
        Cryptocurrencies
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Nombre</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Símbolo</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Precio</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>24h %</TableCell>
            <TableCell sx={{ color: "primary.main", fontWeight: 600 }}>Market Cap</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {demoData.map((crypto) => (
            <CryptoRow key={crypto.symbol} {...crypto} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
