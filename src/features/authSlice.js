// Redux
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// Services
//import { loginUser } from '../services/authService';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Login for production
// export const loginAsync = createAsyncThunk(
//   'auth/login',
//   async ({ email, password }) => {
//     console.log('loginAsync attempt')
//     const response = await loginUser({ email, password });
//     return response; 
//   }
// );

// Login for frontend testing
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    if (email === 'admin@chronotrack.com' && password === '123qwe') {
      const user = {
        name: 'Administrador',
        email,
        role: 'admin',
      };
      const token = 'fake-jwt-token-admin';
      return { user, token };
    }

    return rejectWithValue('Credenciales inválidas');
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    const response = await registerUser({ name, email, password });
    return response; 
  } 
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    hydrate(state, action) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, hydrate } = authSlice.actions;
export default authSlice;
