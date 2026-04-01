"use client";

import { PropsWithChildren, useEffect } from 'react';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from '../src/theme';
import { store, useAppDispatch } from '../src/store';
import { hydrateAuth } from '../src/store/slices/authSlice';
import { getStoredUser, getToken } from '../src/lib/storage';
import { ToastProvider } from '../src/components/ui/ToastProvider';

function AuthHydrator({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      hydrateAuth({
        token: getToken(),
        user: getStoredUser(),
      }),
    );
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <ToastProvider>
          <AuthHydrator>{children}</AuthHydrator>
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
}
