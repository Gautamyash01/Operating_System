from typing import Dict, List, Tuple
from .cpu import schedule_cpu as schedule_cpu_py, CPUSchedulingAlgorithm
from .memory import simulate_paging, PageReplacementAlgorithm
from . import cpu_native


def run_simulation(processes: List[Dict], cpu_algo: CPUSchedulingAlgorithm, page_algo: PageReplacementAlgorithm, time_quantum: int, memory_size: int, page_size: int) -> Tuple[List[Dict], List[Dict], Dict, List[Dict], List[Dict]]:
	if cpu_native.available():
		gantt, updated = cpu_native.schedule_cpu_native(processes, cpu_algo, time_quantum)
	else:
		gantt, updated = schedule_cpu_py(processes, cpu_algo, time_quantum)
	# simple page reference stream: map each process id repeated burstTime times
	page_refs: List[int] = []
	for p in updated:
		page_refs.extend([p['id'] % max(1, memory_size // page_size)] * max(1, p['burstTime']))
	frames, page_table, page_fault_rate = simulate_paging(page_refs, max(1, memory_size // page_size), page_algo)
	stats = _compute_stats(updated, gantt, page_fault_rate)
	return gantt, updated, stats, frames, page_table


def _compute_stats(processes: List[Dict], gantt: List[Dict], page_fault_rate: float) -> Dict:
	avg_wait = sum(p.get('waitingTime', 0) for p in processes) / len(processes) if processes else 0.0
	avg_turn = sum(p.get('turnaroundTime', 0) for p in processes) / len(processes) if processes else 0.0
	if gantt:
		total_time = max(item['endTime'] for item in gantt) - min(item['startTime'] for item in gantt)
		busy = sum(item['endTime'] - item['startTime'] for item in gantt)
		cpu_util = (busy / total_time) if total_time else 1.0
	else:
		cpu_util = 0.0
	memory_util = 0.0
	return {
		'averageWaitingTime': avg_wait,
		'averageTurnaroundTime': avg_turn,
		'pageFaultRate': page_fault_rate,
		'memoryUtilization': memory_util,
		'cpuUtilization': cpu_util,
	}
