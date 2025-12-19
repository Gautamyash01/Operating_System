export interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  memoryRequirement: number;
  remainingTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  startTime?: number;
  completionTime?: number;
}

export interface GanttChartItem {
  processId: number;
  startTime: number;
  endTime: number;
}

export interface MemoryBlock {
  id: number;
  processId: number | null;
  size: number;
  startAddress: number;
}

export interface PageTableEntry {
  pageNumber: number;
  frameNumber: number | null;
  valid: boolean;
  referenced: boolean;
  modified: boolean;
}

export interface Statistics {
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  pageFaultRate: number;
  memoryUtilization: number;
  cpuUtilization: number;
}

export type CPUSchedulingAlgorithm = 'FCFS' | 'SJF' | 'Priority' | 'RoundRobin' | 'SRTF';
export type PageReplacementAlgorithm = 'FIFO' | 'LRU' | 'Optimal' | 'Clock';

export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed';
