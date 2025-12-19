import { useState } from 'react';
import { ProcessInput } from '@/components/ProcessInput';
import { AlgorithmSelector } from '@/components/AlgorithmSelector';
import { GanttChart } from '@/components/GanttChart';
import { MemoryVisualization } from '@/components/MemoryVisualization';
import { StatisticsPanel } from '@/components/StatisticsPanel';
import { SimulationControls } from '@/components/SimulationControls';
import { Process, CPUSchedulingAlgorithm, PageReplacementAlgorithm, GanttChartItem, Statistics, MemoryBlock, PageTableEntry, SimulationStatus } from '@/types/simulator';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

const Index = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [cpuAlgorithm, setCpuAlgorithm] = useState<CPUSchedulingAlgorithm>('FCFS');
  const [pageAlgorithm, setPageAlgorithm] = useState<PageReplacementAlgorithm>('FIFO');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [status, setStatus] = useState<SimulationStatus>('idle');
  
  const [ganttChart, setGanttChart] = useState<GanttChartItem[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    averageWaitingTime: 0,
    averageTurnaroundTime: 0,
    pageFaultRate: 0,
    memoryUtilization: 0,
    cpuUtilization: 0,
  });
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [pageTable, setPageTable] = useState<PageTableEntry[]>([]);

  const memorySize = 1024; // KB
  const pageSize = 4; // KB

  const handleStart = async () => {
    if (processes.length === 0) {
      toast.error('Please add at least one process');
      return;
    }

    setStatus('running');
    toast.success('Simulation started');

    // Simulate API call - replace with actual simulatorApi.startSimulation()
    setTimeout(() => {
      // Mock data for demonstration
      const mockGantt: GanttChartItem[] = processes.map((p, i) => ({
        processId: p.id,
        startTime: i * 5,
        endTime: (i + 1) * 5,
      }));

      const mockStats: Statistics = {
        averageWaitingTime: 12.5,
        averageTurnaroundTime: 18.3,
        pageFaultRate: 0.15,
        memoryUtilization: 0.72,
        cpuUtilization: 0.89,
      };

      const mockMemory: MemoryBlock[] = [
        { id: 1, processId: 1, size: 256, startAddress: 0 },
        { id: 2, processId: 2, size: 128, startAddress: 256 },
        { id: 3, processId: null, size: 640, startAddress: 384 },
      ];

      const mockPageTable: PageTableEntry[] = Array.from({ length: 8 }, (_, i) => ({
        pageNumber: i,
        frameNumber: i < 5 ? i : null,
        valid: i < 5,
        referenced: i < 3,
        modified: i < 2,
      }));

      setGanttChart(mockGantt);
      setStatistics(mockStats);
      setMemoryBlocks(mockMemory);
      setPageTable(mockPageTable);
      setStatus('completed');
      toast.success('Simulation completed');
    }, 2000);
  };

  const handlePause = () => {
    setStatus('paused');
    toast.info('Simulation paused');
  };

  const handleReset = () => {
    setStatus('idle');
    setGanttChart([]);
    setStatistics({
      averageWaitingTime: 0,
      averageTurnaroundTime: 0,
      pageFaultRate: 0,
      memoryUtilization: 0,
      cpuUtilization: 0,
    });
    setMemoryBlocks([]);
    setPageTable([]);
    toast.info('Simulation reset');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Process & Memory Management Simulator
          </h1>
        </div>
        <p className="text-muted-foreground">
          Visualize CPU scheduling algorithms and page replacement strategies
        </p>
      </header>

      <div className="space-y-6">
        <ProcessInput processes={processes} onProcessesChange={setProcesses} />

        <AlgorithmSelector
          cpuAlgorithm={cpuAlgorithm}
          pageAlgorithm={pageAlgorithm}
          timeQuantum={timeQuantum}
          onCpuAlgorithmChange={setCpuAlgorithm}
          onPageAlgorithmChange={setPageAlgorithm}
          onTimeQuantumChange={setTimeQuantum}
        />

        <SimulationControls
          status={status}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          disabled={processes.length === 0}
        />

        <GanttChart ganttChart={ganttChart} />

        <StatisticsPanel statistics={statistics} />

        <MemoryVisualization
          memoryBlocks={memoryBlocks}
          pageTable={pageTable}
          memorySize={memorySize}
        />
      </div>
    </div>
  );
};

export default Index;
