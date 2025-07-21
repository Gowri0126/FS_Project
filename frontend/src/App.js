import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import ExamList from './components/ExamList';

export default function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  if (!token) {
    return (
      <div>
        {showRegister ? (
          <>
            <Register />
            <p>Already have an account? <button onClick={() => setShowRegister(false)}>Login</button></p>
          </>
        ) : (
          <>
            <Login setToken={setToken} setRole={setRole} />
            <p>No account? <button onClick={() => setShowRegister(true)}>Register</button></p>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => { setToken(null); setRole(null); }}>Logout</button>
      <ExamList token={token} />
    </div>
  );
}
