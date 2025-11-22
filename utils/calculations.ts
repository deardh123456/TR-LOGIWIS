import { AppState, CalculationResult } from '../types';

/**
 * Calculates motion time based on trapezoidal velocity profile.
 */
const getMotionTime = (dist: number, v_max: number, a: number, isAccelOnly: boolean): number => {
  if (dist <= 0) return 0;
  if (v_max <= 0 || a <= 0) return 9999;

  const t_acc = v_max / a;
  const d_acc = 0.5 * a * t_acc * t_acc;

  if (isAccelOnly) {
    // Accelerate only (and cruise if needed), no deceleration at end
    if (dist <= d_acc) {
      // Doesn't reach max speed
      return Math.sqrt(2 * dist / a);
    } else {
      // Reaches max speed
      const d_cruise = dist - d_acc;
      const t_cruise = d_cruise / v_max;
      return t_acc + t_cruise;
    }
  } else {
    // Accelerate and Decelerate (Full Stop)
    const total_ramp_dist = 2 * d_acc;
    
    if (dist <= total_ramp_dist) {
      // Triangle profile (doesn't reach max speed)
      // dist = a * t_half^2 -> t_half = sqrt(dist/a)
      // total time = 2 * t_half
      return 2 * Math.sqrt(dist / a);
    } else {
      // Trapezoid profile
      const d_cruise = dist - total_ramp_dist;
      const t_cruise = d_cruise / v_max;
      return (2 * t_acc) + t_cruise;
    }
  }
};

export const calculateResults = (state: AppState): CalculationResult => {
  // 1. Basic Conversions
  const vt_mps = state.vh_speed / 60; // m/min -> m/s
  
  // 2. Inbound Calculation (一进)
  // Logic: Spreadsheet result 15.33s implies Full Distance used (x1+x2+x3 = 4.3m) with Accel+Decel.
  const distIn = state.x1_fixedLength + state.x2_cargoWidth + state.x3_gapIn;
  const timeIn = getMotionTime(distIn, vt_mps, state.ay_accel, false);

  // 3. Outbound Calculation (一出)
  // Logic: Spreadsheet result 9.17s implies Full Distance used (x4+x5+x6 = 2.6m) with Accel Only.
  const distOut = state.x4_transLength + state.x5_cargoLength + state.x6_gapOut;
  const timeOut = getMotionTime(distOut, vt_mps, state.ay_accel, true);

  // 4. Fixed Times
  // tad = 4 switches * t_switch + t_comm + t_delay
  const tad = (4 * state.t_switch) + state.t_comm + state.t_delay;
  
  // Lift Time: Spreadsheet lists tsj=2s. Result 31s implies tsj is counted twice (Up + Down).
  const timeLiftTotal = state.tsj_liftTime * 2;

  // 5. Total Cycle Time (tm1)
  const tm1_cycleTime = timeIn + timeOut + timeLiftTotal + tad;

  // 6. Throughput (n)
  // n = 3600 * efficiency / cycleTime
  const throughput = tm1_cycleTime > 0 ? (3600 * state.efficiency) / tm1_cycleTime : 0;

  return {
    vt_mps,
    distIn,
    timeIn,
    distOut,
    timeOut,
    tad,
    timeLiftTotal,
    tm1_cycleTime,
    throughput
  };
};
