import React from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

export default function Register() {

    const [userName,SetUserName]=useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [CompanyImage,setCompanyImage]=useState(null);
  const [Designation,setDesignation]=useState("");

  const Navigate=useNavigate();
  

  async function handleSubmit(e)
  {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const respons = await fetch("https://localhost:7077/api/Account/Registraction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, email:email,password: password }),
      });

      if (!respons.ok) {
        const errorData = await respons.json();
        throw new Error(errorData.message || 'Registraction  failed');
      }
      
      const TheToken = await respons.json();
      localStorage.setItem("token", TheToken.token);
      console.log('Registered successful:', TheToken);
      setSuccess(true);
      await AsignRole();
      await PersonBioData();
    } catch (err) {
      setError(err.message);
      console.error('Registraction error error:', err);
    } finally {
      setLoading(false);
    }
    
  }

  async function AsignRole(){
    try {
      const respons = await fetch("https://localhost:7077/api/Account/Assign-Role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: userName, role: 'User' }),
      });

    } catch (err) {
      
      console.error('Login error:', err);
    } 
    
  }



  async function PersonBioData() {
    try {
        if (!CompanyImage) {
            console.error('No company image selected.');
            return;
        }
        const formData = new FormData();
        formData.append('UserName', userName);
        formData.append('Designation', Designation);
        formData.append('ImageData', CompanyImage);
        const response = await fetch("https://localhost:7077/api/Account/InsertUserInformation", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            console.log("Data uploaded successfully!");
           
        } else {
            console.error("Failed to upload data. Status:", response.status);
            const errorText = await response.text();
            console.error("Error from server:", errorText);
        }
      Navigate('/login');
    } catch (err) {
        console.error('An error occurred during the fetch call:', err);
    }finally{
      SetUserName('');
    setEmail('');
    setPassword('');
    setCompanyImage(null);
    setDesignation("");
    }
}

  return (
    <div className="registration-container" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userName}
            onChange={(e)=>SetUserName(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e)=>setCompanyImage(e.target.files[0])} 
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
            />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
        <input 
          type="text"
          value={Designation}
          name="designation" 
          placeholder="Headquarters" 
          onChange={(e)=>setDesignation(e.target.value)} 
          required 
          style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}
        />
        </div>    
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}
