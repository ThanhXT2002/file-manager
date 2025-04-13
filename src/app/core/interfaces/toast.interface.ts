export type ToastType = 'success' | 'info' | 'warn' | 'error';
export interface ToastConfig {
  summary?: string;
  detail?: string;
  sticky?: boolean;
  life?: number;
  closable?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}
