import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useStore';
import {
  login,
  register,
  logout,
  getCurrentUser,
} from '@/store/slices/authSlice';
import type { LoginData, RegisterData } from '@/types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = useCallback(
    async (data: LoginData) => {
      try {
        await dispatch(login(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      try {
        await dispatch(register(data)).unwrap();
        return true;
      } catch (error) {
        return false;
      }
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  const loadCurrentUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch]);

  return {
    user,
    token,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loadCurrentUser,
  };
}; 