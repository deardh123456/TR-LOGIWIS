import React from 'react';

interface InputRowProps {
  seq?: number | string;
  label: string;
  value: number;
  onChange?: (val: number) => void;
  unit: string;
  remark?: string;
  extra?: string;
  isInput?: boolean;
  isHeader?: boolean;
  className?: string;
}

export const TableRow: React.FC<InputRowProps> = ({ 
  seq, 
  label, 
  value, 
  onChange, 
  unit, 
  remark, 
  extra,
  isInput = false,
  isHeader = false,
  className = ""
}) => {
  if (isHeader) {
    return (
      <div className="grid grid-cols-12 text-xs font-semibold text-slate-600 bg-slate-50 border-b border-slate-200 select-none uppercase tracking-wider">
        <div className="col-span-1 py-3 px-2 text-center border-r border-slate-200">序号</div>
        <div className="col-span-4 py-3 px-4 text-left border-r border-slate-200">项目名称</div>
        <div className="col-span-2 py-3 px-2 text-center border-r border-slate-200">数值</div>
        <div className="col-span-1 py-3 px-2 text-center border-r border-slate-200">单位</div>
        <div className="col-span-4 py-3 px-4 text-left">说明</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-12 text-sm border-b border-slate-100 last:border-0 hover:bg-blue-50/30 transition-colors group ${className}`}>
      {/* Seq */}
      <div className="col-span-1 py-2 px-2 flex items-center justify-center border-r border-slate-100 text-slate-400 font-mono text-xs group-hover:text-slate-600">
        {seq}
      </div>
      
      {/* Label */}
      <div className="col-span-4 py-2 px-4 flex items-center border-r border-slate-100 font-medium text-slate-700">
        {label}
        {extra && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{extra}</span>}
      </div>
      
      {/* Value Input/Display */}
      <div className="col-span-2 p-1 border-r border-slate-100">
        {isInput && onChange ? (
          <div className="relative w-full h-full">
            <input 
              type="number"
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
              className="w-full h-8 px-2 text-center bg-yellow-50/50 hover:bg-yellow-50 focus:bg-white text-slate-900 font-semibold border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded transition-all outline-none"
            />
          </div>
        ) : (
          <div className="w-full h-8 flex items-center justify-center font-bold text-slate-800 bg-slate-50/50 rounded">
            {Number.isInteger(value) ? value : value.toFixed(3).replace(/\.?0+$/, '')}
          </div>
        )}
      </div>
      
      {/* Unit */}
      <div className="col-span-1 py-2 px-2 flex items-center justify-center border-r border-slate-100 text-slate-500 text-xs">
        {unit}
      </div>
      
      {/* Remark */}
      <div className="col-span-4 py-2 px-4 flex items-center text-slate-400 text-xs italic group-hover:text-slate-500">
        {remark}
      </div>
    </div>
  );
};
