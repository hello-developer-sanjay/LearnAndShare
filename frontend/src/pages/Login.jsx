import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, loginSuccess } from '../actions/authActions';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { RingLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 2rem;
`;

const LoginForm = styled.form`
  background: linear-gradient(135deg, #3a3a3a, #1e1e1e);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  max-width: 400px;
  width: 100%;
  transform: perspective(1000px) rotateY(10deg);
  transition: transform 0.5s ease, box-shadow 0.5s ease;
  &:hover {
    transform: perspective(1000px) rotateY(0);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  font-family: 'Cinzel Decorative', cursive;
  color: #d4af37;
  text-align: center;
  margin-bottom: 2rem;
  animation: ${fadeIn} 1s ease-in-out;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
`;

const Input = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 2px solid #d4af37;
  border-radius: 10px;
  font-size: 1rem;
  width: 100%;
  background-color: #2a2a2a;
  color: #fff;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    border-color: #d4af37;
    outline: none;
    box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #d4af37;
  color: black;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
  &:hover {
    background-color: #e5c370;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
`;

const GoogleButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #db4437;
  color: white;
  margin-top: 1rem;
  &:hover {
    background-color: #c23321;
  }
`;

const GoogleIcon = styled(FontAwesomeIcon)`
  margin-right: 0.5rem;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const ToggleIcon = styled(FontAwesomeIcon)`
  position: absolute;
  right: 10px;
  top: 35%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #d4af37;
`;

const ForgotPasswordLink = styled(Link)`
  display: inline-block;
  margin-top: 10px;
  font-size: 16px;
  color: #d4af37;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: text-shadow 0.5s ease;
  &:hover {
    text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
  }
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
    if (user) {
      const userData = JSON.parse(decodeURIComponent(user));
      dispatch(loginSuccess(userData));
      navigate('/dashboard');
    }
  }, [dispatch, navigate]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const response = await dispatch(login(email, password));
    setLoading(false);
    if (response.success) {
      toast.success('Login successful');
      if (response.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      toast.error(response.message || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://learnandshare-api-27dec.onrender.com/api/auth/google';

  };

  return (
    <Container>
      <LoginForm onSubmit={handleSubmit}>
        <Title aria-label="HogwartsEdx Title">LearnAndShare</Title>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          required
          aria-label="Email"
        />
        <PasswordContainer>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            aria-label="Password"
          />
          <ToggleIcon
            icon={showPassword ? faEyeSlash : faEye}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
          />
        </PasswordContainer>
        <Button type="submit" aria-label="Login Button">
          {loading ? (
            <RingLoader color={'#000000'} loading={loading} size={20} />
          ) : (
            'Login'
          )}
        </Button>
        <GoogleButton onClick={handleGoogleLogin} aria-label="Login with Google">
          <GoogleIcon icon={faGoogle} />
          Login with Google
        </GoogleButton>
        <ForgotPasswordLink to="/forgot-password" aria-label="Forgot Password Link">
          Forgot Password? Click to reset
        </ForgotPasswordLink>
      </LoginForm>
      <ToastContainer />
    </Container>
  );
};

export default Login;
