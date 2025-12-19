import { Card } from '@/components/ui/card';
import { Statistics } from '@/types/simulator';
import { Activity, Clock, AlertCircle, HardDrive, Cpu } from 'lucide-react';

interface StatisticsPanelProps {
  statistics: Statistics;
}

export const StatisticsPanel = ({ statistics }: StatisticsPanelProps) => {
  const stats = [
    {
      label: 'Avg Waiting Time',
      value: statistics.averageWaitingTime.toFixed(2),
      unit: 'ms',
      icon: Clock,
      color: 'text-chart-1',
    },
    {
      label: 'Avg Turnaround Time',
      value: statistics.averageTurnaroundTime.toFixed(2),
      unit: 'ms',
      icon: Activity,
      color: 'text-chart-2',
    },
    {
      label: 'Page Fault Rate',
      value: (statistics.pageFaultRate * 100).toFixed(1),
      unit: '%',
      icon: AlertCircle,
      color: 'text-chart-3',
    },
    {
      label: 'Memory Utilization',
      value: (statistics.memoryUtilization * 100).toFixed(1),
      unit: '%',
      icon: HardDrive,
      color: 'text-chart-4',
    },
    {
      label: 'CPU Utilization',
      value: (statistics.cpuUtilization * 100).toFixed(1),
      unit: '%',
      icon: Cpu,
      color: 'text-chart-5',
    },
  ];

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-semibold mb-6 text-foreground">Performance Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-secondary rounded-lg border border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
