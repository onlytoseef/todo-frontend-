import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isHydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isHydrated = true;
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      state.isHydrated = true;
    },
    hydrateAuth(state, action: PayloadAction<{ token: string | null; user: User | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isHydrated = true;
    },
  },
});

export const { setAuth, clearAuth, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
