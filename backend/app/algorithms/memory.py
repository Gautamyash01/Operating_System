from typing import List, Dict, Literal, Optional, Tuple

PageReplacementAlgorithm = Literal['FIFO', 'LRU', 'Optimal', 'Clock']


def simulate_paging(page_refs: List[int], num_frames: int, algorithm: PageReplacementAlgorithm) -> Tuple[List[Dict], List[Dict], float]:
	"""
	Return (frames_state, page_table, page_fault_rate)
	frames_state: list of {id, processId, size, startAddress} compatible with frontend MemoryBlock (we'll use frame index)
	page_table: list of {pageNumber, frameNumber, valid, referenced, modified}
	"""
	if num_frames <= 0:
		return [], [], 0.0
	if algorithm == 'FIFO':
		return _fifo(page_refs, num_frames)
	if algorithm == 'LRU':
		return _lru(page_refs, num_frames)
	if algorithm == 'Optimal':
		return _optimal(page_refs, num_frames)
	if algorithm == 'Clock':
		return _clock(page_refs, num_frames)
	raise ValueError('Unsupported page algorithm')


def _init_structures(num_frames: int, num_pages: int) -> Tuple[List[Optional[int]], List[Dict]]:
	frames: List[Optional[int]] = [None] * num_frames
	page_table: List[Dict] = [{
		'pageNumber': i,
		'frameNumber': None,
		'valid': False,
		'referenced': False,
		'modified': False,
	} for i in range(max(num_pages, num_frames))]
	return frames, page_table


def _compose_output(frames: List[Optional[int]], page_table: List[Dict], faults: int, total: int) -> Tuple[List[Dict], List[Dict], float]:
	frames_state = [{ 'id': i, 'processId': frames[i], 'size': 1, 'startAddress': i } for i in range(len(frames))]
	return frames_state, page_table, (faults / total if total else 0.0)


def _fifo(refs: List[int], f: int) -> Tuple[List[Dict], List[Dict], float]:
	frames, page_table = _init_structures(f, max(refs)+1 if refs else 0)
	queue: List[int] = []
	faults = 0
	for page in refs:
		entry = page_table[page]
		if entry['valid']:
			entry['referenced'] = True
			continue
		faults += 1
		if len(queue) < f:
			idx = len(queue)
			queue.append(page)
			frames[idx] = page
			entry['frameNumber'] = idx
			entry['valid'] = True
			continue
		victim = queue.pop(0)
		victim_idx = page_table[victim]['frameNumber']
		queue.append(page)
		frames[victim_idx] = page
		page_table[victim] = {**page_table[victim], 'frameNumber': None, 'valid': False}
		entry['frameNumber'] = victim_idx
		entry['valid'] = True
		entry['referenced'] = True
	return _compose_output(frames, page_table, faults, len(refs))


def _lru(refs: List[int], f: int) -> Tuple[List[Dict], List[Dict], float]:
	frames, page_table = _init_structures(f, max(refs)+1 if refs else 0)
	last_used: Dict[int, int] = {}
	faults = 0
	clock = 0
	for page in refs:
		clock += 1
		entry = page_table[page]
		if entry['valid']:
			entry['referenced'] = True
			last_used[page] = clock
			continue
		faults += 1
		# empty slot?
		if any(fr is None for fr in frames):
			idx = frames.index(None)
			frames[idx] = page
			entry['frameNumber'] = idx
			entry['valid'] = True
			last_used[page] = clock
			continue
		# choose least recently used
		victim = min(last_used, key=lambda p: last_used[p]) if last_used else None
		if victim is None:
			victim = frames[0]
		victim_idx = page_table[victim]['frameNumber']
		page_table[victim] = {**page_table[victim], 'frameNumber': None, 'valid': False}
		frames[victim_idx] = page
		entry['frameNumber'] = victim_idx
		entry['valid'] = True
		last_used[page] = clock
	return _compose_output(frames, page_table, faults, len(refs))


def _optimal(refs: List[int], f: int) -> Tuple[List[Dict], List[Dict], float]:
	frames, page_table = _init_structures(f, max(refs)+1 if refs else 0)
	faults = 0
	for i, page in enumerate(refs):
		entry = page_table[page]
		if entry['valid']:
			entry['referenced'] = True
			continue
		faults += 1
		if any(fr is None for fr in frames):
			idx = frames.index(None)
			frames[idx] = page
			entry['frameNumber'] = idx
			entry['valid'] = True
			continue
		# choose victim used farthest in future
		future = refs[i+1:]
		indices = []
		for fr_page in frames:
			try:
				idx = future.index(fr_page)
			except ValueError:
				idx = float('inf')
			indices.append(idx)
		victim_idx = indices.index(max(indices))
		victim = frames[victim_idx]
		page_table[victim] = {**page_table[victim], 'frameNumber': None, 'valid': False}
		frames[victim_idx] = page
		entry['frameNumber'] = victim_idx
		entry['valid'] = True
	return _compose_output(frames, page_table, faults, len(refs))


def _clock(refs: List[int], f: int) -> Tuple[List[Dict], List[Dict], float]:
	frames, page_table = _init_structures(f, max(refs)+1 if refs else 0)
	use_bits: List[int] = [0]*f
	hand = 0
	faults = 0
	loaded: List[Optional[int]] = [None]*f
	for page in refs:
		entry = page_table[page]
		if entry['valid']:
			entry['referenced'] = True
			use_bits[entry['frameNumber']] = 1
			continue
		faults += 1
		# empty slot
		if any(fr is None for fr in loaded):
			idx = loaded.index(None)
			loaded[idx] = page
			frames[idx] = page
			use_bits[idx] = 1
			entry['frameNumber'] = idx
			entry['valid'] = True
			continue
		# find victim with use bit 0
		while use_bits[hand] == 1:
			use_bits[hand] = 0
			hand = (hand + 1) % f
		victim_idx = hand
		victim = frames[victim_idx]
		page_table[victim] = {**page_table[victim], 'frameNumber': None, 'valid': False}
		frames[victim_idx] = page
		loaded[victim_idx] = page
		entry['frameNumber'] = victim_idx
		entry['valid'] = True
		use_bits[victim_idx] = 1
		hand = (hand + 1) % f
	return _compose_output(frames, page_table, faults, len(refs))
