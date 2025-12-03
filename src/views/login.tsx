import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Modal,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import type { LoginData, RegisterData } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  // Estado del login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Estado del registro
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setRegisterError("");
    setRegisterSuccess("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const credentials: LoginData = {
        email: loginEmail,
        password: loginPassword,
      };

      const response = await authService.login(credentials);
      authService.setToken(response.access_token);
      if (response.user) {
        authService.setUser(response.user);
      }

      navigate("/home");
    } catch (error: any) {
      setLoginError(error.message || "Error al iniciar sesión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
    setRegisterSuccess("");
    setRegisterLoading(true);

    if (registerPassword !== registerPasswordConfirm) {
      setRegisterError("Las contraseñas no coinciden");
      setRegisterLoading(false);
      return;
    }

    try {
      const data: RegisterData = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        password_confirmation: registerPasswordConfirm,
      };

      const response = await authService.register(data);
      authService.setToken(response.access_token);
      if (response.user) {
        authService.setUser(response.user);
      }

      setRegisterSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => {
        handleCloseModal();
        navigate("/home");
      }, 1500);
    } catch (error: any) {
      setRegisterError(error.message || "Error en el registro");
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          borderRadius: 3,
          backgroundColor: "background.default",
        }}
      >
        {/* Título */}
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            mb: 3,
            color: "primary.main",
            fontWeight: 700,
          }}
        >
          CryptoWallet
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ mb: 4, color: "text.secondary" }}
        >
          Inicia sesión para continuar
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          {/* Usuario */}
          <TextField
            fullWidth
            label="Correo"
            type="email"
            variant="outlined"
            value={loginEmail}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(e.target.value)}
            disabled={loginLoading}
            required
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "info.main" },
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            }}
          />

          {/* Contraseña */}
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            variant="outlined"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            disabled={loginLoading}
            required
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "info.main" },
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            }}
          />

          {/* Botón de login */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={loginLoading}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              "&:hover": { backgroundColor: "#002237" },
            }}
          >
            {loginLoading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Link inferior */}
        <Box textAlign="center" sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            ¿No tienes cuenta?{" "}
            <span
              style={{ color: "#C1121F", cursor: "pointer", fontWeight: 600 }}
              onClick={handleOpenModal}
            >
              Regístrate
            </span>
          </Typography>
        </Box>
      </Paper>

      {/* Modal de Registro */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            width: "90%",
            maxWidth: 400,
            borderRadius: 3,
            backgroundColor: "background.default",
          }}
        >
          <Typography
            variant="h5"
            textAlign="center"
            sx={{
              mb: 3,
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            Crear Cuenta
          </Typography>

          {registerError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registerError}
            </Alert>
          )}

          {registerSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {registerSuccess}
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            {/* Nombre */}
            <TextField
              fullWidth
              label="Nombre completo"
              variant="outlined"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              disabled={registerLoading}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "info.main" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Correo electrónico"
              type="email"
              variant="outlined"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              disabled={registerLoading}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "info.main" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            {/* Contraseña */}
            <TextField
              fullWidth
              type="password"
              label="Contraseña"
              variant="outlined"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              disabled={registerLoading}
              required
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "info.main" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            {/* Confirmar Contraseña */}
            <TextField
              fullWidth
              type="password"
              label="Confirmar contraseña"
              variant="outlined"
              value={registerPasswordConfirm}
              onChange={(e) => setRegisterPasswordConfirm(e.target.value)}
              disabled={registerLoading}
              required
              sx={{
                mb: 4,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "info.main" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
            />

            {/* Botones */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleCloseModal}
                disabled={registerLoading}
                sx={{
                  borderColor: "primary.main",
                  color: "primary.main",
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={registerLoading}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "#002237" },
                }}
              >
                {registerLoading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Modal>
    </Container>
  );
}
