"use client";

import FormTextField from './FormTextField';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function OtpInput({ value, onChange }: Props) {
  return (
    <FormTextField
      label="OTP"
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
      inputProps={{ maxLength: 6 }}
      placeholder="Enter 6-digit OTP"
      required
    />
  );
}
