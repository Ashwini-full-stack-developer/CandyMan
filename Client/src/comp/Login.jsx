import React from 'react'
import { useState,useEffect } from 'react'
import { Link,useNavigate } from 'react-router';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const Navigate=useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const respons = await fetch("https://localhost:7077/api/Account/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: email, password: password }),
      });

      if (!respons.ok) {
        const errorData = await respons.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const TheToken = await respons.json();
      localStorage.setItem("token", TheToken.token);
      console.log('Login successful:', TheToken);
      localStorage.setItem("user",TheToken.user)


      if (TheToken.roles && Array.isArray(TheToken.roles) && TheToken.roles.length > 0) {
            const jobRole = TheToken.roles[0];
            localStorage.setItem("jobRole", jobRole);
            console.log("User role found:", jobRole);
            switch (jobRole) {
                case "User":
                    Navigate("/userpage");
                    break;
                case "Admin":
                    Navigate("/adminPage");
                    break;
                default:
                    alert("Unknown job role");
            }
        } 
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div style={{fontSize:'4rem',color:'#FF3E80',fontFamily: 'cursive'}}>Candy Man Project</div>
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2 style={{color:'#FF3E80'}}>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="UserName"
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '10px' }}>Login successful! 🎉</p>}
      <p>Dont't you have account?<Link to="/Register">SignUp.</Link> </p>
    </div>
    </>
  )
}
