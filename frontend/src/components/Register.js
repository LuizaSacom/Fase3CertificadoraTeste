import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, InputAdornment } from '@mui/material';
import backgroundImage from '../assets/login.png'; 
import AccountCircle from '@mui/icons-material/AccountCircle'; 
import LockIcon from '@mui/icons-material/Lock'; 
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!username || !password) {
      setMessage('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();

      if (response.ok) {
        setMessage('Cadastro realizado com sucesso. Faça login.');
        setUsername('');
        setPassword('');
      } else {
        setMessage(result.error || 'Erro ao realizar o cadastro.');
      }
    } catch (err) {
      setMessage('Erro ao se conectar ao servidor.');
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
        Cadastro
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
            placeholder="Nome de usuário"
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
                  <LockIcon style={{ color: 'white' }} />
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
                Cadastrar
              </Button>

              {message && <Typography sx={{ mt: 2, color: 'white' }}>{message}</Typography>}

              <Box sx={{ mt: 2 }}>
                <Link
                  to="/"
                  variant="body2"
                  sx={{ color: 'white', display: 'block', textAlign: 'center' }}
                >
                  Voltar para o Login
                </Link>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Register;