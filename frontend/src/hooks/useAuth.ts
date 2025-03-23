import { useAppDispatch, useAppSelector } from './useStore';
import { login, logout, register, getCurrentUser } from '@/store/slices/authSlice';
import type { LoginData, RegisterData } from '@/types/auth';
import type { RootState } from '@/store';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, loading, error } = useAppSelector((state: RootState) => state.auth);

  const handleLogin = async (data: LoginData) => {
    try {
      await dispatch(login(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      await dispatch(register(data)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const loadCurrentUser = async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

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