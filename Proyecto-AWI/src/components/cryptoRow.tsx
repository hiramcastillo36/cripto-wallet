import { TableRow, TableCell } from "@mui/material";

interface CryptoRowProps {
  name: string;
  symbol: string;
  price: string;
  change24h: string;
  marketCap: string;
}

export default function CryptoRow({
  name,
  symbol,
  price,
  change24h,
  marketCap,
}: CryptoRowProps) {
  const isPositive = Number(change24h) >= 0;

  return (
    <TableRow
      sx={{
        backgroundColor: "warning.main",
        "&:hover": { backgroundColor: "info.main" },
      }}
    >
      <TableCell>{name}</TableCell>
      <TableCell>{symbol.toUpperCase()}</TableCell>
      <TableCell>${price}</TableCell>
      <TableCell sx={{ color: isPositive ? "success.main" : "error.main" }}>
        {change24h}%
      </TableCell>
      <TableCell>${marketCap}</TableCell>
    </TableRow>
  );
}
