import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { SimulationStatus } from '@/types/simulator';

interface SimulationControlsProps {
  status: SimulationStatus;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export const SimulationControls = ({
  status,
  onStart,
  onPause,
  onReset,
  disabled = false,
}: SimulationControlsProps) => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              status === 'running' ? 'bg-chart-4 animate-pulse' :
              status === 'paused' ? 'bg-chart-5' :
              status === 'completed' ? 'bg-chart-2' :
              'bg-muted'
            }`} />
            <span className="text-sm font-medium text-foreground capitalize">{status}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {status === 'running' ? (
            <Button
              onClick={onPause}
              variant="secondary"
              size="lg"
              className="min-w-32"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={onStart}
              disabled={disabled || status === 'completed'}
              size="lg"
              className="min-w-32 bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4 mr-2" />
              {status === 'paused' ? 'Resume' : 'Start'}
            </Button>
          )}
          
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="min-w-32 border-border hover:bg-secondary"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
};
