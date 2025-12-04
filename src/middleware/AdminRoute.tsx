import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Box, CircularProgress, Alert } from '@mui/material';

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Validar que sea admin
        const isAdminUser = await authService.validateAdmin();
        setIsAdmin(isAdminUser);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  // Mientras se valida, mostrar un loading
  if (isAdmin === null) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Si no es admin, mostrar error y redirigir
  if (!isAdmin) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <Alert severity="error">
          No tienes permisos para acceder a esta sección. Solo administradores pueden acceder.
        </Alert>
      </Box>
    );
  }

  // Si es admin, renderizar el componente
  return <>{children}</>;
}
