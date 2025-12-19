import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Process } from '@/types/simulator';
import { toast } from 'sonner';

interface ProcessInputProps {
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
}

export const ProcessInput = ({ processes, onProcessesChange }: ProcessInputProps) => {
  const [newProcess, setNewProcess] = useState({
    arrivalTime: 0,
    burstTime: 1,
    priority: 1,
    memoryRequirement: 100,
  });

  const addProcess = () => {
    if (newProcess.burstTime <= 0) {
      toast.error('Burst time must be greater than 0');
      return;
    }
    if (newProcess.memoryRequirement <= 0) {
      toast.error('Memory requirement must be greater than 0');
      return;
    }

    const process: Process = {
      id: processes.length + 1,
      ...newProcess,
    };

    onProcessesChange([...processes, process]);
    toast.success(`Process P${process.id} added`);
  };

  const removeProcess = (id: number) => {
    onProcessesChange(processes.filter(p => p.id !== id));
    toast.success('Process removed');
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Process Input</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="arrivalTime">Arrival Time</Label>
          <Input
            id="arrivalTime"
            type="number"
            min="0"
            value={newProcess.arrivalTime}
            onChange={(e) => setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="burstTime">Burst Time</Label>
          <Input
            id="burstTime"
            type="number"
            min="1"
            value={newProcess.burstTime}
            onChange={(e) => setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Input
            id="priority"
            type="number"
            min="1"
            value={newProcess.priority}
            onChange={(e) => setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 1 })}
            className="bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label htmlFor="memory">Memory (KB)</Label>
          <Input
            id="memory"
            type="number"
            min="1"
            value={newProcess.memoryRequirement}
            onChange={(e) => setNewProcess({ ...newProcess, memoryRequirement: parseInt(e.target.value) || 100 })}
            className="bg-input border-border text-foreground"
          />
        </div>
      </div>

      <Button onClick={addProcess} className="w-full md:w-auto mb-6 bg-primary hover:bg-primary/90">
        <Plus className="w-4 h-4 mr-2" />
        Add Process
      </Button>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Processes</h3>
        {processes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No processes added yet</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {processes.map((process) => (
              <div key={process.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border">
                <div className="flex-1 grid grid-cols-5 gap-4 font-mono text-sm">
                  <span className="text-accent font-semibold">P{process.id}</span>
                  <span className="text-muted-foreground">AT: {process.arrivalTime}</span>
                  <span className="text-muted-foreground">BT: {process.burstTime}</span>
                  <span className="text-muted-foreground">Priority: {process.priority}</span>
                  <span className="text-muted-foreground">Mem: {process.memoryRequirement}KB</span>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeProcess(process.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
