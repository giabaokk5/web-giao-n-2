import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : toast.type === 'warning'
              ? 'bg-amber-500 text-slate-900 shadow-amber-200'
              : toast.type === 'error'
              ? 'bg-rose-600 text-white shadow-rose-200'
              : 'bg-slate-900 text-white shadow-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0 text-slate-900" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 shrink-0 text-white" />}
            {toast.type === 'info' && <Info className="w-5 h-5 shrink-0 text-yellow-300" />}
            <span className="leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 p-1 rounded-md hover:bg-black/10 transition-colors"
          >
            <X className="w-4 h-4 opacity-75 hover:opacity-100" />
          </button>
        </div>
      ))}
    </div>
  );
};

