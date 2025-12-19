from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict


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


class ProcessCreate(BaseModel):
	arrivalTime: int
	burstTime: int
	priority: int
	memoryRequirement: int


router = APIRouter()

# In-memory store for simplicity; can swap with DB later
_processes: Dict[int, Process] = {}
_next_id: int = 1


@router.get("/processes", response_model=List[Process])
async def list_processes() -> List[Process]:
	return list(_processes.values())


@router.post("/processes", response_model=Process)
async def create_process(payload: ProcessCreate) -> Process:
	global _next_id
	pid = _next_id
	_next_id += 1
	proc = Process(id=pid, **payload.model_dump())
	_processes[pid] = proc
	return proc


@router.get("/processes/{pid}", response_model=Process)
async def get_process(pid: int) -> Process:
	proc = _processes.get(pid)
	if not proc:
		raise HTTPException(status_code=404, detail="Process not found")
	return proc


class ProcessUpdate(BaseModel):
	arrivalTime: Optional[int] = None
	burstTime: Optional[int] = None
	priority: Optional[int] = None
	memoryRequirement: Optional[int] = None


@router.patch("/processes/{pid}", response_model=Process)
async def update_process(pid: int, payload: ProcessUpdate) -> Process:
	proc = _processes.get(pid)
	if not proc:
		raise HTTPException(status_code=404, detail="Process not found")
	updates = payload.model_dump(exclude_unset=True)
	updated = proc.model_copy(update=updates)
	_processes[pid] = updated
	return updated


@router.delete("/processes/{pid}")
async def delete_process(pid: int) -> dict:
	if pid in _processes:
		del _processes[pid]
		return {"deleted": True}
	raise HTTPException(status_code=404, detail="Process not found")
