import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authService } from '../Auth/authService';
import { setCredentials, logout } from '../../slices/authSlice';
import { useLoginMutation, useLogoutMutation, useRegisterMutation } from '../../slices/userApiSlice';
import { useState } from 'react';
import { IUser } from '../../config/applicatonConfig';

interface RegisterData {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
  bio?: string;
}

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [registerMutation] = useRegisterMutation();

  const { userInfo } = useSelector((state: { auth: { userInfo: IUser } }) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await loginMutation({ email, password }).unwrap();
      
      if (response) {
        dispatch(setCredentials(response));
      }
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      await logoutMutation('').unwrap();
      dispatch(logout());
      authService.clearAuth();
      
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await registerMutation(data).unwrap();
      
      if (response) {
        authService.setUser(response);
        dispatch(setCredentials(response));
      }

      return response;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logoutUser,
    register,
    error,
    loading,
    isAuthenticated: authService.isAuthenticated(),
    user: userInfo
  };
};