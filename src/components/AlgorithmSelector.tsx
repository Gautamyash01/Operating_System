import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CPUSchedulingAlgorithm, PageReplacementAlgorithm } from '@/types/simulator';
import { Cpu, HardDrive } from 'lucide-react';

interface AlgorithmSelectorProps {
  cpuAlgorithm: CPUSchedulingAlgorithm;
  pageAlgorithm: PageReplacementAlgorithm;
  timeQuantum: number;
  onCpuAlgorithmChange: (algorithm: CPUSchedulingAlgorithm) => void;
  onPageAlgorithmChange: (algorithm: PageReplacementAlgorithm) => void;
  onTimeQuantumChange: (quantum: number) => void;
}

export const AlgorithmSelector = ({
  cpuAlgorithm,
  pageAlgorithm,
  timeQuantum,
  onCpuAlgorithmChange,
  onPageAlgorithmChange,
  onTimeQuantumChange,
}: AlgorithmSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">CPU Scheduling</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="cpuAlgorithm">Algorithm</Label>
            <Select value={cpuAlgorithm} onValueChange={onCpuAlgorithmChange}>
              <SelectTrigger id="cpuAlgorithm" className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="FCFS">First Come First Serve (FCFS)</SelectItem>
                <SelectItem value="SJF">Shortest Job First (SJF)</SelectItem>
                <SelectItem value="SRTF">Shortest Remaining Time First (SRTF)</SelectItem>
                <SelectItem value="Priority">Priority Scheduling</SelectItem>
                <SelectItem value="RoundRobin">Round Robin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {cpuAlgorithm === 'RoundRobin' && (
            <div>
              <Label htmlFor="timeQuantum">Time Quantum</Label>
              <Input
                id="timeQuantum"
                type="number"
                min="1"
                value={timeQuantum}
                onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
                className="bg-input border-border text-foreground"
              />
            </div>
          )}

          <div className="p-3 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              {cpuAlgorithm === 'FCFS' && 'Processes are executed in order of arrival.'}
              {cpuAlgorithm === 'SJF' && 'Process with shortest burst time is executed first.'}
              {cpuAlgorithm === 'SRTF' && 'Preemptive version of SJF. Process with shortest remaining time is executed.'}
              {cpuAlgorithm === 'Priority' && 'Process with highest priority is executed first.'}
              {cpuAlgorithm === 'RoundRobin' && 'Each process gets a fixed time quantum in circular order.'}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Page Replacement</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="pageAlgorithm">Algorithm</Label>
            <Select value={pageAlgorithm} onValueChange={onPageAlgorithmChange}>
              <SelectTrigger id="pageAlgorithm" className="bg-input border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="FIFO">First In First Out (FIFO)</SelectItem>
                <SelectItem value="LRU">Least Recently Used (LRU)</SelectItem>
                <SelectItem value="Optimal">Optimal Page Replacement</SelectItem>
                <SelectItem value="Clock">Clock Algorithm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              {pageAlgorithm === 'FIFO' && 'Replaces the oldest page in memory.'}
              {pageAlgorithm === 'LRU' && 'Replaces the page that has not been used for the longest time.'}
              {pageAlgorithm === 'Optimal' && 'Replaces the page that will not be used for the longest time in the future.'}
              {pageAlgorithm === 'Clock' && 'Uses a circular queue and reference bit to approximate LRU.'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
