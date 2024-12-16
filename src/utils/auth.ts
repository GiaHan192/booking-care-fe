import Cookies from 'js-cookie';

interface User {
  fullName?: string
  email?: string
}

export const getUser = (): User | null => {
  const accessToken = Cookies.get('access_token');
  const fullName = Cookies.get('fullName');
  const email = Cookies.get('email')
  
  if (!accessToken) return null;
  
  return {
    fullName: fullName || '',
    email: email || ''
  }
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('access_token');
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('fullName');
  Cookies.remove('email')
  window.location.href = '/login';
};
