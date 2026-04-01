"use client";

import { Box, Typography } from '@mui/material';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export default function AuthFormShell({ title, subtitle, children }: Props) {
  return (
    <Box display="flex" flexDirection="column" gap={2.5}>
      <Box>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">{subtitle}</Typography>
      </Box>
      {children}
    </Box>
  );
}
