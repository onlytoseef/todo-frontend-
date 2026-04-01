"use client";

import { Alert } from '@mui/material';

interface Props {
  message: string;
}

export default function ErrorAlert({ message }: Props) {
  return <Alert severity="error">{message}</Alert>;
}
