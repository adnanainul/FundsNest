import { useEffect } from 'react';
import { CheckCircle, X, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const styles = {
        success: 'bg-green-50 border-green-500 text-green-800',
        error: 'bg-red-50 border-red-500 text-red-800',
        info: 'bg-blue-50 border-blue-500 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-500 text-yellow-800'
    };

    const icons = {
        success: <CheckCircle className="h-5 w-5" />,
        error: <X className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <AlertTriangle className="h-5 w-5" />
    };

    return (
        <div className={`fixed top-4 right-4 z-50 min-w-[300px] max-w-md border-l-4 ${styles[type]} p-4 rounded-lg shadow-lg animate-slide-in`}>
            <div className="flex items-start">
                <div className="flex-shrink-0">{icons[type]}</div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{message}</p>
                </div>
                <button onClick={onClose} className="ml-4 flex-shrink-0">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: ToastType }>;
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
