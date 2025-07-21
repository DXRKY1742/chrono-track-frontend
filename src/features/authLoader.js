// src/components/AuthLoader.jsx
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { hydrate, logout } from './authSlice';

const AuthLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      dispatch(hydrate({ token, user }));
    } else {
      dispatch(logout());
    }
  }, []);

  return null;
};

export default AuthLoader;
