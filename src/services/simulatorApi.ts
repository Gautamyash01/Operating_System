import { Process, CPUSchedulingAlgorithm, PageReplacementAlgorithm, GanttChartItem, Statistics, MemoryBlock, PageTableEntry } from '@/types/simulator';

// API base URL - configure this based on your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface SimulationRequest {
  processes: Process[];
  cpuAlgorithm: CPUSchedulingAlgorithm;
  pageAlgorithm: PageReplacementAlgorithm;
  timeQuantum?: number;
  memorySize: number;
  pageSize: number;
}

export interface SimulationResponse {
  ganttChart: GanttChartItem[];
  processes: Process[];
  statistics: Statistics;
  memoryBlocks: MemoryBlock[];
  pageTable: PageTableEntry[];
}

class SimulatorAPI {
  async startSimulation(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Simulation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Simulation API error:', error);
      throw error;
    }
  }

  async getSimulationStatus(simulationId: string): Promise<{ status: string; progress: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate/${simulationId}/status`);
      
      if (!response.ok) {
        throw new Error(`Failed to get status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Status API error:', error);
      throw error;
    }
  }

  async pauseSimulation(simulationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate/${simulationId}/pause`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to pause: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Pause API error:', error);
      throw error;
    }
  }

  async resumeSimulation(simulationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/simulate/${simulationId}/resume`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to resume: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Resume API error:', error);
      throw error;
    }
  }
}

export const simulatorApi = new SimulatorAPI();
