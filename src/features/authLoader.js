// src/components/AuthLoader.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrate, logout } from './authSlice';

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    let user

    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (error) {
      console.warn('Error parsing user from localStorage:', error);
      user = null;
    }

    const isValidUser = user && typeof user === 'object' && user !== null && user.id;

    if (token && isValidUser) {
      dispatch(hydrate({ token, user }));
    } else {
      dispatch(logout());
    }
  }, []);

  return null;
};

export default AuthLoader;
