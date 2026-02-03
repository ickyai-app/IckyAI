'use client';

import { useState } from 'react';
import LoginPage from '@/components/LoginPage';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setUser({ name: 'Demo User' });
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} />;
}
