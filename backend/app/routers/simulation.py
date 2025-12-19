from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal, Dict, Any
from ..algorithms.orchestrator import run_simulation


CPUSchedulingAlgorithm = Literal['FCFS', 'SJF', 'Priority', 'RoundRobin', 'SRTF']
PageReplacementAlgorithm = Literal['FIFO', 'LRU', 'Optimal', 'Clock']


class Process(BaseModel):
	id: int
	arrivalTime: int
	burstTime: int
	priority: int
	memoryRequirement: int
	remainingTime: Optional[int] = None
	waitingTime: Optional[int] = None
	turnaroundTime: Optional[int] = None
	startTime: Optional[int] = None
	completionTime: Optional[int] = None


class GanttChartItem(BaseModel):
	processId: int
	startTime: int
	endTime: int


class MemoryBlock(BaseModel):
	id: int
	processId: Optional[int]
	size: int
	startAddress: int


class PageTableEntry(BaseModel):
	pageNumber: int
	frameNumber: Optional[int]
	valid: bool
	referenced: bool
	modified: bool


class Statistics(BaseModel):
	averageWaitingTime: float
	averageTurnaroundTime: float
	pageFaultRate: float
	memoryUtilization: float
	cpuUtilization: float


class SimulationRequest(BaseModel):
	processes: List[Process]
	cpuAlgorithm: CPUSchedulingAlgorithm
	pageAlgorithm: PageReplacementAlgorithm
	timeQuantum: Optional[int] = None
	memorySize: int
	pageSize: int


class SimulationResponse(BaseModel):
	ganttChart: List[GanttChartItem]
	processes: List[Process]
	statistics: Statistics
	memoryBlocks: List[MemoryBlock]
	pageTable: List[PageTableEntry]


router = APIRouter()


@router.post('/simulate', response_model=SimulationResponse)
async def simulate(req: SimulationRequest) -> SimulationResponse:
	gantt, updated, stats, frames, page_table = run_simulation(
		[p.model_dump() for p in req.processes],
		req.cpuAlgorithm,
		req.pageAlgorithm,
		req.timeQuantum or 1,
		req.memorySize,
		req.pageSize,
	)
	return SimulationResponse(
		ganttChart=[GanttChartItem(**g) for g in gantt],
		processes=[Process(**p) for p in updated],
		statistics=Statistics(**stats),
		memoryBlocks=[MemoryBlock(**b) for b in frames],
		pageTable=[PageTableEntry(**e) for e in page_table],
	)


# Optional: status/pause/resume stubs to satisfy frontend API shape

_status_store: Dict[str, Dict[str, Any]] = {}


@router.get('/simulate/{simulationId}/status')
async def get_status(simulationId: str) -> Dict[str, Any]:
	return _status_store.get(simulationId, {"status": "completed", "progress": 100})


@router.post('/simulate/{simulationId}/pause')
async def pause_simulation(simulationId: str) -> Dict[str, bool]:
	_status_store[simulationId] = {"status": "paused", "progress": 50}
	return {"ok": True}


@router.post('/simulate/{simulationId}/resume')
async def resume_simulation(simulationId: str) -> Dict[str, bool]:
	_status_store[simulationId] = {"status": "running", "progress": 75}
	return {"ok": True}
