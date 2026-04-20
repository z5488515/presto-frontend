// register.tsx

import axios from 'axios';
import React, { useState } from 'react';
import styles from './Register.module.css';

interface RegisterProps {
  successCallback: (_token: string) => void;
  onError: (_msg: string) => void;
}

function Register({ successCallback }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const validate = (): string => {
    if (!email) return 'Email is required';
    if (!name) return 'Name is required';
    if (!password) return 'Password is required';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  };

  const register = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const response = await axios.post("http://localhost:5005/admin/auth/register", {
        email,
        password,
        name,
      });
      successCallback(response.data.token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Route backend errors through setError so they match the local error box styling
        setError(err.response?.data?.error ?? 'Registration failed');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') register();
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.subheading}>Get started with Presto</p>
        {error && (
          <div className={styles.errorBox}>
            <p>{error}</p>
            <button onClick={() => setError('')}>✕</button>
          </div>
        )}
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            className={styles.input}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your name"
          />
        </div>
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
        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input
            className={styles.input}
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="••••••••"
          />
        </div>
        <button className={styles.submitBtn} onClick={register}>Create account</button>
      </div>
    </div>
  );
}

export default Register;