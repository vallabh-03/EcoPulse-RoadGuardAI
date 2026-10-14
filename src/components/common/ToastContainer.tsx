import React from 'react';
import { useEcoPulse } from '../../context/EcoPulseContext.tsx';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useEcoPulse();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        let IconComponent = Info;
        let iconColor = 'text-emerald-700';
        let borderColor = 'border-slate-200';

        if (toast.type === 'success') {
          IconComponent = CheckCircle2;
          iconColor = 'text-emerald-600';
          borderColor = 'border-emerald-200';
        } else if (toast.type === 'error' || toast.type === 'warning') {
          IconComponent = AlertCircle;
          iconColor = 'text-amber-600';
          borderColor = 'border-amber-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-white border ${borderColor} rounded-xl shadow-lg transition-all duration-200`}
          >
            <IconComponent className={`w-5 h-5 ${iconColor} shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
