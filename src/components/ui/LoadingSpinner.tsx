interface LoadingSpinnerProps {
  size?: 'sm' | 'md';
}

export default function LoadingSpinner({ size = 'md' }: Readonly<LoadingSpinnerProps>) {
  return <span className={`loading-spinner ${size === 'sm' ? 'loading-spinner-sm' : ''}`} aria-hidden="true" />;
}
