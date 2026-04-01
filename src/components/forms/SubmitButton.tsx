"use client";

import { Button, CircularProgress } from '@mui/material';

interface Props {
  loading: boolean;
  children: string;
}

export default function SubmitButton({ loading, children }: Props) {
  return (
    <Button type="submit" variant="contained" disabled={loading} sx={{ minHeight: 40 }}>
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Button>
  );
}
