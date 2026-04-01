"use client";

import { Box, Container, Paper } from '@mui/material';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  narrow?: boolean;
}

export default function PageShell({ children, narrow = false }: Props) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 6,
        background:
          'radial-gradient(circle at 10% 20%, rgba(15,118,110,0.15), transparent 25%), radial-gradient(circle at 80% 0%, rgba(234,88,12,0.15), transparent 25%), #f4f4f0',
      }}
    >
      <Container maxWidth={narrow ? 'sm' : 'md'}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, border: '1px solid #e6e6df' }}>
          {children}
        </Paper>
      </Container>
    </Box>
  );
}
