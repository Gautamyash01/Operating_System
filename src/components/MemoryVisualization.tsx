import { Card } from '@/components/ui/card';
import { MemoryBlock, PageTableEntry } from '@/types/simulator';
import { Database, Table } from 'lucide-react';

interface MemoryVisualizationProps {
  memoryBlocks: MemoryBlock[];
  pageTable: PageTableEntry[];
  memorySize: number;
}

export const MemoryVisualization = ({ memoryBlocks, pageTable, memorySize }: MemoryVisualizationProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Memory Map</h2>
        </div>

        {memoryBlocks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No memory allocation data yet
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-64 bg-secondary rounded-lg border border-border overflow-hidden relative">
              {memoryBlocks.map((block) => {
                const height = (block.size / memorySize) * 100;
                const top = (block.startAddress / memorySize) * 100;
                
                return (
                  <div
                    key={block.id}
                    className={`absolute w-full border-b border-background ${
                      block.processId ? 'bg-primary/70' : 'bg-muted/50'
                    } transition-all duration-300`}
                    style={{
                      height: `${height}%`,
                      top: `${top}%`,
                    }}
                  >
                    <div className="p-2 text-xs font-mono text-foreground">
                      {block.processId ? `P${block.processId}` : 'Free'}
                      <div className="text-muted-foreground">
                        {block.size}KB
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
              <span>0x0000</span>
              <span>Address Space</span>
              <span>0x{memorySize.toString(16).toUpperCase()}</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-6">
          <Table className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Page Table</h2>
        </div>

        {pageTable.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No page table data yet
          </div>
        ) : (
          <div className="h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-secondary border-b border-border">
                <tr className="font-mono text-xs text-muted-foreground">
                  <th className="p-2 text-left">Page</th>
                  <th className="p-2 text-left">Frame</th>
                  <th className="p-2 text-center">Valid</th>
                  <th className="p-2 text-center">Ref</th>
                  <th className="p-2 text-center">Mod</th>
                </tr>
              </thead>
              <tbody className="font-mono text-foreground">
                {pageTable.map((entry) => (
                  <tr key={entry.pageNumber} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="p-2">{entry.pageNumber}</td>
                    <td className="p-2">{entry.frameNumber ?? '-'}</td>
                    <td className="p-2 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${entry.valid ? 'bg-chart-4' : 'bg-destructive'}`} />
                    </td>
                    <td className="p-2 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${entry.referenced ? 'bg-chart-2' : 'bg-muted'}`} />
                    </td>
                    <td className="p-2 text-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${entry.modified ? 'bg-chart-3' : 'bg-muted'}`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
