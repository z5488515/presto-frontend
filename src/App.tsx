// App.tsx
import './App.css'
import styles from './App.module.css'
import { useEffect, useState } from 'react';
import { Routes, Route, Link } from "react-router-dom"
import Register from './page/Register';
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import { useNavigate, useLocation } from "react-router-dom"
import axios from 'axios';
import PresentationPage from './page/PresentationPage';
import Landing from './page/Landing';
import PreviewPage from './page/PreviewPage';


function App() {
  
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [globalError, setGlobalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isPreview = location.pathname.startsWith('/preview');

  useEffect(() => {
    const clear = () => setGlobalError(null);
    clear();
  }, [location.pathname]);

  function fn(token: string) {
    localStorage.setItem('token', token);
    setToken(token);
    navigate('/dashboard');
  }

  async function logout() {
    try {
      await axios.post("http://localhost:5005/admin/auth/logout", {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch {
      // logout locally regardless
    }
    setToken(null);
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className={styles.appShell}>

      {!isPreview && (
        <div className={styles.navbar}>
          <span className={styles.logo}>Presto</span>
          <div className={styles.navLinks}>
            {token ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
      
      {globalError && (
        <div className={styles.errorPopup}>
          <p>{globalError}</p>
          <button onClick={() => setGlobalError(null)}>✕</button>
        </div>
      )}
      <div className={isPreview ? styles.previewShell : styles.routeShell}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard token={token ?? ''} onError={setGlobalError} />} />
          <Route path="/register" element={<Register successCallback={fn} onError={setGlobalError} />} />
          <Route path="/login" element={<Login successCallback={fn} onError={setGlobalError} />} />
          <Route path="/presentation/:id/:slideIndex?" element={<PresentationPage token={token ?? ''} onError={setGlobalError} />} />
          <Route path="/preview/:id/:slideIndex" element={<PreviewPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App
