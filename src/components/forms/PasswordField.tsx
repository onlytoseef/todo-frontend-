"use client";

import { IconButton, InputAdornment, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import FormTextField from './FormTextField';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function PasswordField(props: TextFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <FormTextField
      {...props}
      type={show ? 'text' : 'password'}
      InputProps={{
        ...(props.InputProps || {}),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton edge="end" onClick={() => setShow((prev) => !prev)}>
              {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
