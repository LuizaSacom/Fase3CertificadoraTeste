import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok) {
        // Você pode processar ou armazenar os dados se precisar
      } else {
        throw new Error(result.message || 'Erro ao buscar dados');
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/'); //Redireciona para a página de login
  };

  return (
    <Box sx={{ padding: 4, backgroundColor: '#f5f5f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#6f4f28', mb: 2 }}>
        Bem-vindo(a), {username || 'Usuário'}
      </Typography>

      {/* Botão de Logout */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ mb: 3 }}
        startIcon={<ExitToApp />}
      >
        Sair
      </Button>

      {loading && <CircularProgress />}
    </Box>
  );
}

export default Dashboard;
