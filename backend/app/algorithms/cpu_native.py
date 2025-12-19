import ctypes
import os
from typing import List, Dict, Optional, Tuple


class ProcIn(ctypes.Structure):
	_fields_ = [
		('id', ctypes.c_int),
		('arrival', ctypes.c_int),
		('burst', ctypes.c_int),
		('priority', ctypes.c_int),
	]


class GanttItem(ctypes.Structure):
	_fields_ = [
		('id', ctypes.c_int),
		('start', ctypes.c_int),
		('end', ctypes.c_int),
	]


class ProcOut(ctypes.Structure):
	_fields_ = [
		('startTime', ctypes.c_int),
		('completionTime', ctypes.c_int),
		('waitingTime', ctypes.c_int),
		('turnaroundTime', ctypes.c_int),
	]


def _load_library() -> Optional[ctypes.CDLL]:
	dll_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'native', 'scheduler.dll')
	if not os.path.exists(dll_path):
		return None
	lib = ctypes.CDLL(dll_path)
	lib.schedule.argtypes = [ctypes.POINTER(ProcIn), ctypes.c_int, ctypes.c_char_p, ctypes.c_int, ctypes.POINTER(GanttItem), ctypes.c_int, ctypes.POINTER(ProcOut)]
	lib.schedule.restype = ctypes.c_int
	return lib


_lib = _load_library()


def available() -> bool:
	return _lib is not None


def schedule_cpu_native(processes: List[Dict], algorithm: str, time_quantum: Optional[int] = None) -> Tuple[List[Dict], List[Dict]]:
	if _lib is None:
		raise RuntimeError('Native scheduler not available')
	count = len(processes)
	arr = (ProcIn * count)(*[
		ProcIn(p['id'], p['arrivalTime'], p['burstTime'], p['priority']) for p in processes
	])
	g_capacity = max(1, sum(max(1, p.get('burstTime', 1)) for p in processes)) * 2
	g_arr = (GanttItem * g_capacity)()
	p_out = (ProcOut * count)()
	algo = algorithm.encode('utf-8')
	gi = _lib.schedule(arr, count, algo, int(time_quantum or 1), g_arr, g_capacity, p_out)
	gantt: List[Dict] = []
	for i in range(max(0, gi)):
		gantt.append({'processId': g_arr[i].id, 'startTime': g_arr[i].start, 'endTime': g_arr[i].end})
	updated: List[Dict] = []
	for i, p in enumerate(processes):
		u = dict(p)
		u['startTime'] = p_out[i].startTime
		u['completionTime'] = p_out[i].completionTime
		u['waitingTime'] = p_out[i].waitingTime
		u['turnaroundTime'] = p_out[i].turnaroundTime
		updated.append(u)
	return gantt, updated
