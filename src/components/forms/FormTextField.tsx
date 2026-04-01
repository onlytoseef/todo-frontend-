"use client";

import { TextField, TextFieldProps } from '@mui/material';

export default function FormTextField(props: TextFieldProps) {
  return <TextField fullWidth size="small" {...props} />;
}
