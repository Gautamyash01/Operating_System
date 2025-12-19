from typing import List, Dict, Literal, Optional, Tuple

CPUSchedulingAlgorithm = Literal['FCFS', 'SJF', 'Priority', 'RoundRobin', 'SRTF']


class Process(dict):
	pass


def _clone_processes(processes: List[Dict]) -> List[Process]:
	return [Process(p.copy()) for p in processes]


def schedule_cpu(processes: List[Dict], algorithm: CPUSchedulingAlgorithm, time_quantum: Optional[int] = None) -> Tuple[List[Dict], List[Dict]]:
	"""
	Return (gantt, updated_processes)
	gantt: [{processId, startTime, endTime}]
	updated_processes: processes with waitingTime, turnaroundTime, startTime, completionTime
	"""
	procs = _clone_processes(processes)
	gantt: List[Dict] = []

	if not procs:
		return gantt, []

	if algorithm == 'FCFS':
		return _schedule_fcfs(procs)
	if algorithm == 'SJF':
		return _schedule_sjf(procs)
	if algorithm == 'Priority':
		return _schedule_priority(procs)
	if algorithm == 'RoundRobin':
		if not time_quantum or time_quantum <= 0:
			time_quantum = 1
		return _schedule_rr(procs, time_quantum)
	if algorithm == 'SRTF':
		return _schedule_srtf(procs)

	raise ValueError('Unsupported CPU algorithm')


def _schedule_fcfs(processes: List[Process]) -> Tuple[List[Dict], List[Dict]]:
	clock = 0
	gantt: List[Dict] = []
	for p in sorted(processes, key=lambda x: x['arrivalTime']):
		if clock < p['arrivalTime']:
			clock = p['arrivalTime']
		p['startTime'] = clock
		clock += p['burstTime']
		p['completionTime'] = clock
		p['turnaroundTime'] = p['completionTime'] - p['arrivalTime']
		p['waitingTime'] = p['turnaroundTime'] - p['burstTime']
		gantt.append({'processId': p['id'], 'startTime': p['startTime'], 'endTime': p['completionTime']})
	return gantt, processes


def _schedule_sjf(processes: List[Process]) -> Tuple[List[Dict], List[Dict]]:
	clock = 0
	ready: List[Process] = []
	remaining = sorted(processes, key=lambda x: x['arrivalTime'])
	gantt: List[Dict] = []
	while remaining or ready:
		while remaining and remaining[0]['arrivalTime'] <= clock:
			ready.append(remaining.pop(0))
		if not ready:
			clock = remaining[0]['arrivalTime']
			continue
		ready.sort(key=lambda x: x['burstTime'])
		p = ready.pop(0)
		p['startTime'] = clock
		clock += p['burstTime']
		p['completionTime'] = clock
		p['turnaroundTime'] = p['completionTime'] - p['arrivalTime']
		p['waitingTime'] = p['turnaroundTime'] - p['burstTime']
		gantt.append({'processId': p['id'], 'startTime': p['startTime'], 'endTime': p['completionTime']})
	return gantt, processes


def _schedule_priority(processes: List[Process]) -> Tuple[List[Dict], List[Dict]]:
	clock = 0
	ready: List[Process] = []
	remaining = sorted(processes, key=lambda x: x['arrivalTime'])
	gantt: List[Dict] = []
	while remaining or ready:
		while remaining and remaining[0]['arrivalTime'] <= clock:
			ready.append(remaining.pop(0))
		if not ready:
			clock = remaining[0]['arrivalTime']
			continue
		ready.sort(key=lambda x: x['priority'])
		p = ready.pop(0)
		p['startTime'] = clock
		clock += p['burstTime']
		p['completionTime'] = clock
		p['turnaroundTime'] = p['completionTime'] - p['arrivalTime']
		p['waitingTime'] = p['turnaroundTime'] - p['burstTime']
		gantt.append({'processId': p['id'], 'startTime': p['startTime'], 'endTime': p['completionTime']})
	return gantt, processes


def _schedule_rr(processes: List[Process], tq: int) -> Tuple[List[Dict], List[Dict]]:
	clock = 0
	queue: List[Process] = []
	remaining = sorted(processes, key=lambda x: x['arrivalTime'])
	gantt: List[Dict] = []
	for p in processes:
		p['remainingTime'] = p.get('remainingTime', p['burstTime'])
		p['startTime'] = None
	while remaining or queue:
		while remaining and remaining[0]['arrivalTime'] <= clock:
			queue.append(remaining.pop(0))
		if not queue:
			clock = remaining[0]['arrivalTime']
			continue
		p = queue.pop(0)
		slice_time = min(tq, p['remainingTime'])
		if p['startTime'] is None:
			p['startTime'] = clock
		start = clock
		clock += slice_time
		p['remainingTime'] -= slice_time
		gantt.append({'processId': p['id'], 'startTime': start, 'endTime': clock})
		while remaining and remaining[0]['arrivalTime'] <= clock:
			queue.append(remaining.pop(0))
		if p['remainingTime'] > 0:
			queue.append(p)
		else:
			p['completionTime'] = clock
			p['turnaroundTime'] = p['completionTime'] - p['arrivalTime']
			p['waitingTime'] = p['turnaroundTime'] - p['burstTime']
	return gantt, processes


def _schedule_srtf(processes: List[Process]) -> Tuple[List[Dict], List[Dict]]:
	clock = 0
	gantt: List[Dict] = []
	remaining = [Process(p) for p in processes]
	for p in remaining:
		p['remainingTime'] = p.get('remainingTime', p['burstTime'])
	current: Optional[Process] = None
	last_switch = clock
	while True:
		arrived = [p for p in remaining if p['arrivalTime'] <= clock and p['remainingTime'] > 0]
		if not arrived:
			next_arrival = min((p['arrivalTime'] for p in remaining if p['remainingTime'] > 0), default=None)
			if next_arrival is None:
				break
			clock = next_arrival
			continue
		candidate = min(arrived, key=lambda x: x['remainingTime'])
		if current is not candidate:
			if current is not None and last_switch != clock:
				gantt.append({'processId': current['id'], 'startTime': last_switch, 'endTime': clock})
			current = candidate
			if current.get('startTime') is None:
				current['startTime'] = clock
			last_switch = clock
		# run 1 unit
		current['remainingTime'] -= 1
		clock += 1
		if current['remainingTime'] == 0:
			gantt.append({'processId': current['id'], 'startTime': last_switch, 'endTime': clock})
			current['completionTime'] = clock
			current['turnaroundTime'] = current['completionTime'] - current['arrivalTime']
			current['waitingTime'] = current['turnaroundTime'] - current['burstTime']
			current = None
			last_switch = clock
		if all(p['remainingTime'] == 0 for p in remaining):
			break
	return gantt, remaining
