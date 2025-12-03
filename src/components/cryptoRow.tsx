import { TableRow, TableCell } from "@mui/material";

interface CryptoRowProps {
  name: string;
  symbol: string;
  price: string;
}

export default function CryptoRow({
  name,
  symbol,
  price,
}: CryptoRowProps) {
  return (
    <TableRow
      sx={{
        backgroundColor: "warning.main",
        "&:hover": { backgroundColor: "info.main" },
      }}
    >
      <TableCell>{name}</TableCell>
      <TableCell>{symbol.toUpperCase()}</TableCell>
      <TableCell>{price}</TableCell>
    </TableRow>
  );
}
