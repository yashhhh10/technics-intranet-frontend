/*import logo from '../assets/logo copy.png';
import React from 'react'; 
import "../styles/login.css";

function Login(){
    return(
        <div className='Login-page'>
            <div className='logo-section'>
                <img src='/assets/logo.png' alt ="Tecnics-logo" className='logo'/>
                <div className='what-we-do'>
                    <h2>WHAT WE DO</h2>
                    <p>
                        Tecnics focuses on meeting your organizational demands through consulting, managed services and next generation platform services.
Across its portfolio, we leverage the capabilities and services around automation, security, compliance, and analytics to bring you better business availability, easier connectivity, and stronger productivity.
                    </p>
                </div>
            </div>
            <div className='login-box'>
                <h2>Portal Login</h2>
                <input type='text'placeholder='Username' />
                <input type='password' placeholder='Password' />
                <button>Login</button> 
                <p><a href="#">Forgot your password? Click Here</a></p>         
                
                </div>
        </div>
    
    );
}

export default Logi*/
import React, { useState } from 'react';
import { loginAndGetToken } from '../utils/auth';
import '../styles/login.css';
import logo from '../assets/logocopy.png'; // Import the CSS file

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await loginAndGetToken(formData.username, formData.password);
      window.location.reload(); // Reload to mount dashboard after login
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  return (
    <div className="container">
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="Tecnics Logo" />
        </div>
        <div className="what-we-do">
          <h2>WHAT WE DO</h2>
          <p>
            Tecnics focuses on meeting your organizational demands through consulting, 
            managed services and next generation platform services. Across its portfolio, 
            we leverage the capabilities and services around automation, security, 
            compliance, and analytics to bring you better business availability, 
            easier connectivity, and stronger productivity.
          </p>
        
      </div>
      
      <div className="right-section">
        <div className="login-container">
          <div className="login-header">
            <div className="user-icon">👤</div>
          </div>
          <div className="login-form">
            <h2>Portal Login</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="username"
                placeholder="Username" 
                value={formData.username}
                onChange={handleInputChange}
                required 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                required 
              />
              <button type="submit">Login</button>
              {error && <div className="login-error" style={{ color: 'red', marginTop: '8px' }}>{error}</div>}
              <a href="#" className="forgot-password" onClick={handleForgotPassword} >
                Forgot your password? Click Here
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
