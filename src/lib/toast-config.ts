import { toast as hotToast, ToastOptions } from 'react-hot-toast';

// Custom toast configurations
const baseToastStyle = {
  background: '#1a1a1a',
  color: '#fff',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '12px',
  padding: '16px 20px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.1)',
  backdropFilter: 'blur(10px)',
  maxWidth: '400px',
};

// Enhanced toast functions with custom styling
export const toast = {
  // Success toast with icon
  success: (message: string, options?: ToastOptions) => {
    return hotToast.success(message, {
      duration: 3500,
      style: {
        ...baseToastStyle,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f2e1d 100%)',
        border: '1px solid rgba(34, 197, 94, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.3)',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#fff',
      },
      ...options,
    });
  },

  // Error toast with icon
  error: (message: string, options?: ToastOptions) => {
    return hotToast.error(message, {
      duration: 4500,
      style: {
        ...baseToastStyle,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2e0f0f 100%)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(239, 68, 68, 0.3)',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
      ...options,
    });
  },

  // Warning toast
  warning: (message: string, options?: ToastOptions) => {
    return hotToast(message, {
      duration: 4000,
      icon: '⚠️',
      style: {
        ...baseToastStyle,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2e2207 100%)',
        border: '1px solid rgba(234, 179, 8, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(234, 179, 8, 0.3)',
      },
      ...options,
    });
  },

  // Info toast
  info: (message: string, options?: ToastOptions) => {
    return hotToast(message, {
      duration: 4000,
      icon: 'ℹ️',
      style: {
        ...baseToastStyle,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f1e2e 100%)',
        border: '1px solid rgba(59, 130, 246, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 130, 246, 0.3)',
      },
      ...options,
    });
  },

  // Loading toast
  loading: (message: string, options?: ToastOptions) => {
    return hotToast.loading(message, {
      style: {
        ...baseToastStyle,
        background: 'linear-gradient(135deg, #1a1a1a 0%, #1e293b 100%)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
      ...options,
    });
  },

  // Promise toast for async operations
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: ToastOptions
  ) => {
    return hotToast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        style: baseToastStyle,
        success: {
          style: {
            ...baseToastStyle,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0f2e1d 100%)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(34, 197, 94, 0.3)',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        },
        error: {
          style: {
            ...baseToastStyle,
            background: 'linear-gradient(135deg, #1a1a1a 0%, #2e0f0f 100%)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 0 20px rgba(239, 68, 68, 0.3)',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        ...options,
      }
    );
  },

  // Custom toast with custom icon
  custom: (message: string, icon?: string, options?: ToastOptions) => {
    return hotToast(message, {
      duration: 4000,
      icon: icon,
      style: baseToastStyle,
      ...options,
    });
  },

  // Dismiss a specific toast
  dismiss: (toastId?: string) => {
    return hotToast.dismiss(toastId);
  },

  // Dismiss all toasts
  dismissAll: () => {
    return hotToast.dismiss();
  },
};

export default toast;
