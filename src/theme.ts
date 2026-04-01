import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f766e',
    },
    secondary: {
      main: '#ea580c',
    },
    background: {
      default: '#f4f4f0',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
});
