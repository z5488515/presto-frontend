// Login.tsx

import axios from 'axios';
import React, { useState } from 'react';
import styles from './Login.module.css';

interface LoginProps {
  successCallback: (_token: string) => void;
  onError: (_msg: string) => void;
}

function Login({ successCallback, onError }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const response = await axios.post("http://localhost:5005/admin/auth/login", {
        email,
        password,
      });
      successCallback(response.data.token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        onError(err.response?.data?.error ?? 'Login failed');
      } else {
        onError('An unexpected error occurred');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') login();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Sign in</h1>
        <p className={styles.subheading}>Welcome back to Presto</p>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="you@example.com"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>
        <button className={styles.submitBtn} onClick={login}>Sign in</button>
      </div>
    </div>
  );
}

export default Login;