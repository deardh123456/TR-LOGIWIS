export interface AppState {
  // 1. Dimensions (Input)
  x1_fixedLength: number;      // x1: 固定输送机设备长度
  x2_cargoWidth: number;       // x2: 货物宽度
  x3_gapIn: number;            // x3: 托盘输送间隙
  
  x4_transLength: number;      // x4: 移栽输送机设备长度
  x5_cargoLength: number;      // x5: 货物长度
  x6_gapOut: number;           // x6: 托盘输送间隙 (Out)

  // 2. Kinematics (Input)
  vh_speed: number;            // vh: 输送速度 (m/min)
  ay_accel: number;            // ay: 输送加速度 (m/s^2)
  efficiency: number;          // η: 效率

  // 3. Timing Constants (Input/Config)
  tsj_liftTime: number;        // tsj: 顶升、下降单行程时间
  t_switch: number;            // 动作切换时间
  t_comm: number;              // 电气通讯响应时间
  t_delay: number;             // 托盘离开设备延时
}

export interface CalculationResult {
  // Intermediate
  vt_mps: number;              // vt (m/s)
  
  // Inbound Phase
  distIn: number;
  timeIn: number;              // t(x1) In
  
  // Outbound Phase
  distOut: number;
  timeOut: number;             // t(x1) Out
  
  // Fixed Times
  tad: number;                 // 动作切换、定位、校验等时间
  timeLiftTotal: number;       // 2 * tsj
  
  // Final
  tm1_cycleTime: number;       // 平均单一作业循环时间
  throughput: number;          // n: 输送能力 (托盘/小时)
}
