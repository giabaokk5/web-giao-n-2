import React from 'react';

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs animate-pulse">
      <div className="h-44 bg-slate-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        <div className="pt-2 border-t border-slate-100 flex justify-between">
          <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 bg-slate-200 rounded-md w-full"></div>
        </td>
      ))}
    </tr>
  );
};

