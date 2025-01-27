import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, CircularProgress, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom'; // Importando o Link do react-router-dom
import backgroundImage from '../assets/login.png';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');  
      } else {
        setError(result.message || 'Erro ao processar a solicitação');
      }
    } catch (err) {
      setError('Erro ao se conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      {/* Fundo roxo sólido */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#9762FF', 
          zIndex: 0, 
        }}
      ></Box>

      
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1, 
        }}
      ></Box>

      
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: 'white',
          fontFamily: 'Gliker, sans-serif',
          zIndex: 2,
        }}
      >
        Gerenciador de Investimentos
      </Typography>

      <Box
        sx={{
          padding: 2,
          borderRadius: 2,
          width: '100%',
          maxWidth: '400px',
          zIndex: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle style={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                borderRadius: '16px',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
            }}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            InputLabelProps={{
              shrink: false,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock style={{ color: 'white' }} />
                </InputAdornment>
              ),
              style: {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                borderRadius: '16px',
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.8)' },
                '&.Mui-focused fieldset': { borderColor: 'white' },
              },
            }}
          />

          {error && <Typography color="error">{error}</Typography>}

          {loading ? (
            <CircularProgress
              sx={{ display: 'block', margin: '10px auto', color: 'white' }}
            />
          ) : (
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: '16px',
                  '&:hover': { backgroundColor: 'rgba(200, 200, 200, 1)' },
                }}
              >
                Entrar
              </Button>

              <Box
                sx={{
                  display: 'block', 
                  textAlign: 'center',
                  mt: 2, 
                }}
              >
                <Link
                  to="/forgot-password"
                  variant="body2"
                  sx={{ color: 'white', display: 'block', mb: 1 }} 
                >
                  Esqueceu a senha?
                </Link>
              </Box>
              <Box
                sx={{
                  display: 'block', 
                  textAlign: 'center',
                  mt: 2, 
                }}
              >
                <Link
                  to="/register"
                  variant="body2"
                  sx={{ color: 'white', display: 'block' }} 
                >
                  Cadastrar-se
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;