import { toast } from 'react-toastify';

export const showSuccess = (msg) => toast.success(msg);
export const showError = (msg) => toast.error(msg);

// export const showSuccess = (msg) => toast.success(msg, { className: 'my-success' });
// export const showError = (msg) => toast.error(msg, { className: 'my-error' });