declare module 'react-toastify' {
  interface Toast {
    success(message: string): void;
    error(message: string): void;
    info(message: string): void;
    warning(message: string): void;
  }
  const toast: Toast;
  export { toast };
}

declare module '@mui/material' {
  export * from '@mui/material';
}

declare module '@mui/icons-material' {
  export * from '@mui/icons-material';
}

declare module 'react-router-dom' {
  export function useNavigate(): (to: string) => void;
}
