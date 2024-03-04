import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

axios.defaults.withCredentials = true;

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(API_BASE_URL + 'user')
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
      });
  }, []);

  function updateFormBtn() {
    setRegistrationToggle(!registrationToggle);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = { email, username, password };
    const endpoint = registrationToggle ? 'register' : 'login';
    axios.post(API_BASE_URL + endpoint, data)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        setError(error.response?.data?.message || 'An error occurred.');
      });
  }

  function handleLogout(e) {
    e.preventDefault();
    axios.post(API_BASE_URL + 'logout')
      .then(() => {
        setCurrentUser(null);
      })
      .catch((error) => {
        console.error('Error logging out:', error);
        setError('Logout failed.');
      });
  }

  return (
    <div className="container">
      {currentUser ? (
        <div>
          <h1>Welcome, {currentUser.username}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Authentication</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {registrationToggle && (
              <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            )}
            <div>
              <label>Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit">{registrationToggle ? 'Register' : 'Login'}</button>
          </form>
          <p className="switch" onClick={updateFormBtn}>
            {registrationToggle ? 'Already have an account? Login' : 'Don\'t have an account? Register'}
          </p>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
