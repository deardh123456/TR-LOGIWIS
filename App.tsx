import React, { useState, useMemo } from 'react';
import { Calculator, Printer, RotateCcw, Settings, FileText, Minimize2, X, Square } from 'lucide-react';
import { AppState } from './types';
import { calculateResults } from './utils/calculations';
import { TableRow } from './components/InputField';
import { ResultsDisplay } from './components/ResultsDisplay';

const INITIAL_STATE: AppState = {
  x1_fixedLength: 0.3,
  x2_cargoWidth: 3.8,
  x3_gapIn: 0.2,
  x4_transLength: 0,
  x5_cargoLength: 2.4,
  x6_gapOut: 0.2,
  vh_speed: 18,
  ay_accel: 0.3,
  efficiency: 0.85,
  tsj_liftTime: 2.0,
  t_switch: 0.25,
  t_comm: 1.0,
  t_delay: 0.5,
};

export default function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const update = (key: keyof AppState, val: number) => {
    setState(prev => ({ ...prev, [key]: val }));
  };

  const results = useMemo(() => calculateResults(state), [state]);

  return (
    <div className="w-full max-w-6xl h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 ring-1 ring-slate-900/5">
      
      {/* Window Title Bar */}
      <div className="h-10 bg-slate-900 flex justify-between items-center px-4 select-none flex-shrink-0">
        <div className="flex items-center gap-2 text-slate-200">
          <Calculator className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold tracking-wide">Transfer Machine Calculator Pro v1.0.4</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600 hover:bg-slate-500 cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600 hover:bg-red-500 cursor-pointer transition-colors"></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="h-12 border-b border-slate-200 bg-white flex items-center px-4 gap-2 flex-shrink-0 shadow-sm z-10">
        <button 
          onClick={() => setState(INITIAL_STATE)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          重置参数
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          打印报告
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
          <FileText className="w-4 h-4 text-slate-500" />
          导出 Excel
        </button>
        <div className="flex-grow"></div>
        <div className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100">
          STATUS: READY
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Panel: Input Grid */}
        <div className="flex-grow flex flex-col min-w-0 bg-white">
          <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center sticky top-0">
            <div>
              <h2 className="text-base font-bold text-slate-800">参数配置</h2>
              <p className="text-xs text-slate-500 mt-0.5">Parameter Configuration</p>
            </div>
            <Settings className="w-4 h-4 text-slate-300" />
          </div>

          <div className="overflow-y-auto custom-scrollbar p-6">
            <div className="border border-slate-200 rounded-lg shadow-sm bg-white overflow-hidden">
              <TableRow isHeader label="" value={0} unit="" />
              
              <TableRow 
                seq={1} label="x1 固定输送机长度" 
                value={state.x1_fixedLength} onChange={v => update('x1_fixedLength', v)}
                unit="m" remark="通常为 0.3m" isInput
              />
              <TableRow 
                seq={2} label="x2 货物宽度" 
                value={state.x2_cargoWidth} onChange={v => update('x2_cargoWidth', v)}
                unit="m" remark="包含托盘" isInput
              />
              <TableRow 
                seq={3} label="x3 托盘输送间隙 (进)" 
                value={state.x3_gapIn} onChange={v => update('x3_gapIn', v)}
                unit="m" remark="通常 0.2m" isInput
              />
              <TableRow 
                seq={4} label="x4 移栽输送机长度" 
                value={state.x4_transLength} onChange={v => update('x4_transLength', v)}
                unit="m" remark="通常为 0" isInput
              />
              <TableRow 
                seq={5} label="x5 货物长度" 
                value={state.x5_cargoLength} onChange={v => update('x5_cargoLength', v)}
                unit="m" remark="包含托盘" isInput
              />
              <TableRow 
                seq={6} label="x6 托盘输送间隙 (出)" 
                value={state.x6_gapOut} onChange={v => update('x6_gapOut', v)}
                unit="m" remark="通常 0.2m" isInput
              />
              <TableRow 
                seq={7} label="vh 输送速度" 
                value={state.vh_speed} onChange={v => update('vh_speed', v)}
                unit="m/min" remark="推荐 12-20" isInput
              />
              <TableRow 
                seq={8} label="ay 输送加速度" 
                value={state.ay_accel} onChange={v => update('ay_accel', v)}
                unit="m/s²" remark="推荐 0.3-0.5" isInput
              />
              <TableRow 
                seq={9} label="η 综合效率系数" 
                value={state.efficiency} onChange={v => update('efficiency', v)}
                unit="-" remark="范围 0.8-0.9" isInput
              />

              {/* Advanced Section Header */}
              <div className="bg-slate-50 px-4 py-2 border-y border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider mt-0">
                高级时间设定 (Timing)
              </div>
              
              <TableRow 
                seq="T1" label="tsj 顶升/下降单程" 
                value={state.tsj_liftTime} onChange={v => update('tsj_liftTime', v)}
                unit="s" remark="单次动作耗时" isInput
              />
              <TableRow 
                seq="T2" label="动作切换时间" 
                value={state.t_switch} onChange={v => update('t_switch', v)}
                unit="s" remark="机械响应延时" isInput
              />
              <TableRow 
                seq="T3" label="电气通讯响应" 
                value={state.t_comm} onChange={v => update('t_comm', v)}
                unit="s" remark="PLC 握手" isInput
              />
              <TableRow 
                seq="T4" label="离场延时" 
                value={state.t_delay} onChange={v => update('t_delay', v)}
                unit="s" remark="安全Buffer" isInput
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Results Dashboard */}
        <div className="w-[400px] bg-slate-50 border-l border-slate-200 flex flex-col flex-shrink-0">
          <div className="px-6 py-4 border-b border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-800">计算结果</h2>
            <p className="text-xs text-slate-500 mt-0.5">Analysis Report</p>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <ResultsDisplay results={results} />
            
            <div className="mt-8 pt-6 border-t border-slate-200">
               <div className="text-[10px] text-slate-400 space-y-2 leading-normal">
                  <p><strong>注1：</strong> 移栽机边缘至链条机输送开始端头的距离通常为 0.3~1m。</p>
                  <p><strong>注2：</strong> 运动学模型采用梯形速度曲线计算 (Trapezoidal Velocity Profile)。</p>
                  <p><strong>注3：</strong> 进货 (Inbound) 包含完整的加速与减速过程；出货 (Outbound) 仅计算加速过程。</p>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
