import { Card } from '@/components/ui/card';
import { GanttChartItem } from '@/types/simulator';
import { BarChart3 } from 'lucide-react';

interface GanttChartProps {
  ganttChart: GanttChartItem[];
}

export const GanttChart = ({ ganttChart }: GanttChartProps) => {
  const maxTime = ganttChart.length > 0 
    ? Math.max(...ganttChart.map(item => item.endTime))
    : 0;

  const colors = [
    'bg-chart-1',
    'bg-chart-2',
    'bg-chart-3',
    'bg-chart-4',
    'bg-chart-5',
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Gantt Chart</h2>
      </div>

      {ganttChart.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No simulation data yet. Start the simulation to see the Gantt chart.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-24 bg-secondary rounded-lg border border-border overflow-hidden">
            {ganttChart.map((item, index) => {
              const width = ((item.endTime - item.startTime) / maxTime) * 100;
              const left = (item.startTime / maxTime) * 100;
              
              return (
                <div
                  key={index}
                  className={`absolute h-full flex items-center justify-center ${colors[item.processId % colors.length]} transition-all duration-300 border-r border-background`}
                  style={{
                    width: `${width}%`,
                    left: `${left}%`,
                  }}
                  title={`P${item.processId}: ${item.startTime}-${item.endTime}`}
                >
                  <span className="font-mono text-sm font-semibold text-background">
                    P{item.processId}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-xs text-muted-foreground font-mono">
            {Array.from({ length: Math.min(maxTime + 1, 11) }, (_, i) => (
              <span key={i}>{Math.floor((i * maxTime) / 10)}</span>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Array.from(new Set(ganttChart.map(item => item.processId))).map((processId, index) => (
              <div key={processId} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colors[processId % colors.length]}`} />
                <span className="text-sm font-mono text-foreground">P{processId}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
