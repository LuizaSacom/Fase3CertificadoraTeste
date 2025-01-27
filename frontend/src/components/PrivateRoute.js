import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');

  // Função para verificar a validade do token (opcional, se for JWT)
  const isTokenValid = () => {
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do JWT
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; // Verifica se o token expirou
    } catch (error) {
      return false; // Caso o token seja inválido ou não seja um JWT
    }
  };

  // Se o token não existir ou for inválido, redireciona para o login
  if (!token || !isTokenValid()) {
    localStorage.removeItem('token'); // Remove o token inválido ou expirado
    return <Navigate to="/" />; // Redireciona para a página de login
  }

  // Se o token for válido, renderiza as rotas filhas (Dashboard)
  return <Outlet />;
};

export default PrivateRoute;