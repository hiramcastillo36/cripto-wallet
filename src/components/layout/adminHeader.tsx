import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import LogoutIcon from "@mui/icons-material/Logout";

export default function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <AppBar color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: "bold", flexGrow: 1 }}
        >
          Crypto Wallet - Admin
        </Typography>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}
