import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
      <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-3 text-amber-500 font-black text-2xl shadow-inner">
        {icon || '🍽️'}
      </div>
      <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#FFC700] hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

