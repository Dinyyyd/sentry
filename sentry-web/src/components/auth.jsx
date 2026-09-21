import { useState } from 'react';
import Login from './Login';
import MainApp from './MainApp';

export default function Auth() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return <MainApp onLogout={() => setIsLoggedIn(false)} />;
}