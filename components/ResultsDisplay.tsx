import React from 'react';
import { CalculationResult } from '../types';
import { Timer, ArrowRight, ArrowLeft, ArrowUp, Activity } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit: string;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, subtext, icon, variant = 'default' }) => {
  const variants = {
    default: "bg-white border-slate-200",
    primary: "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-600 shadow-md",
    success: "bg-emerald-50 border-emerald-200 text-emerald-900",
    warning: "bg-amber-50 border-amber-200 text-amber-900",
  };

  const textColors = {
    default: "text-slate-900",
    primary: "text-white",
    success: "text-emerald-700",
    warning: "text-amber-700",
  };

  const labelColors = {
    default: "text-slate-500",
    primary: "text-blue-100",
    success: "text-emerald-600",
    warning: "text-amber-600",
  };

  return (
    <div className={`p-4 rounded-lg border flex flex-col justify-between h-full ${variants[variant]}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs font-semibold uppercase tracking-wider ${labelColors[variant]}`}>{label}</span>
        {icon && <div className={`opacity-80 ${variant === 'primary' ? 'text-blue-200' : ''}`}>{icon}</div>}
      </div>
      <div>
        <div className={`text-2xl font-bold font-mono tracking-tight ${textColors[variant]}`}>
          {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(2)) : value}
          <span className={`ml-1 text-sm font-normal opacity-70`}>{unit}</span>
        </div>
        {subtext && <div className={`text-[10px] mt-1 opacity-60`}>{subtext}</div>}
      </div>
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: number;
  unit: string;
  desc?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, unit, desc }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
    <div className="flex flex-col">
      <span className="text-slate-600 font-medium">{label}</span>
      {desc && <span className="text-[10px] text-slate-400">{desc}</span>}
    </div>
    <div className="flex items-baseline gap-1">
      <span className="font-mono font-bold text-slate-700">
        {Number.isInteger(value) ? value : value.toFixed(3)}
      </span>
      <span className="text-xs text-slate-400 w-6 text-right">{unit}</span>
    </div>
  </div>
);

export const ResultsDisplay: React.FC<{ results: CalculationResult }> = ({ results }) => {
  return (
    <div className="space-y-6">
      
      {/* Top Level Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          variant="primary"
          label="系统输送能力 (Capacity)"
          value={results.throughput}
          unit="托盘/时"
          subtext="Efficiency factor included"
          icon={<Activity size={18} />}
        />
        <MetricCard 
          label="单循环时间 (Cycle Time)"
          value={results.tm1_cycleTime}
          unit="s"
          subtext="Total tm1"
          icon={<Timer size={18} className="text-slate-400" />}
        />
      </div>

      {/* Detailed Breakdown Panels */}
      <div className="space-y-4">
        
        {/* Inbound */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <ArrowRight size={14} className="text-emerald-500" /> 
              进货行程 (Inbound)
            </span>
            <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded text-slate-600">S = {results.distIn.toFixed(2)}m</span>
          </div>
          <div className="p-4 pt-2">
            <DetailRow label="输送速度 (vt)" value={results.vt_mps} unit="m/s" />
            <DetailRow label="行程耗时" value={results.timeIn} unit="s" desc="加减速 (Trapezoidal)" />
          </div>
        </div>

        {/* Outbound */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <ArrowLeft size={14} className="text-amber-500" /> 
              出货行程 (Outbound)
            </span>
            <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded text-slate-600">S = {results.distOut.toFixed(2)}m</span>
          </div>
          <div className="p-4 pt-2">
             <DetailRow label="输送速度 (vt)" value={results.vt_mps} unit="m/s" />
             <DetailRow label="行程耗时" value={results.timeOut} unit="s" desc="仅加速 (Accel Only)" />
          </div>
        </div>

        {/* Vertical/Fixed */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
           <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
              <ArrowUp size={14} className="text-blue-500" /> 
              固定动作 (Fixed)
            </span>
            <span className="text-[10px] font-mono bg-slate-200 px-1.5 rounded text-slate-600">Total = {(results.timeLiftTotal + results.tad).toFixed(2)}s</span>
          </div>
          <div className="p-4 pt-2">
            <DetailRow label="顶升+下降总时" value={results.timeLiftTotal} unit="s" desc="双程动作" />
            <DetailRow label="切换/定位/通讯" value={results.tad} unit="s" desc="辅助时间" />
          </div>
        </div>

      </div>
    </div>
  );
};
