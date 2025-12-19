#include "scheduler.h"
#include <string.h>

static int min_index_by_burst(const ProcIn* p, const int* idxs, int n) {
	int best = 0;
	for (int i = 1; i < n; ++i) if (p[idxs[i]].burst < p[idxs[best]].burst) best = i;
	return best;
}

static int min_index_by_priority(const ProcIn* p, const int* idxs, int n) {
	int best = 0;
	for (int i = 1; i < n; ++i) if (p[idxs[i]].priority < p[idxs[best]].priority) best = i;
	return best;
}

static int fcfs(const ProcIn* procs, int count, GanttItem* g, ProcOut* out) {
	int t = 0, gi = 0;
	for (int i = 0; i < count; ++i) {
		if (t < procs[i].arrival) t = procs[i].arrival;
		out[i].startTime = t;
		t += procs[i].burst;
		out[i].completionTime = t;
		out[i].turnaroundTime = out[i].completionTime - procs[i].arrival;
		out[i].waitingTime = out[i].turnaroundTime - procs[i].burst;
		g[gi].id = procs[i].id; g[gi].start = out[i].startTime; g[gi].end = t; gi++;
	}
	return gi;
}

static int sjf(const ProcIn* procs, int count, GanttItem* g, ProcOut* out) {
	int done = 0, t = 0, gi = 0;
	int used[1024]; memset(used, 0, sizeof(used));
	while (done < count) {
		int ready[1024]; int rn = 0;
		for (int i = 0; i < count; ++i) if (!used[i] && procs[i].arrival <= t) ready[rn++] = i;
		if (rn == 0) {
			int next = 1e9; for (int i = 0; i < count; ++i) if (!used[i] && procs[i].arrival < next) next = procs[i].arrival;
			t = next; continue;
		}
		int m = min_index_by_burst(procs, ready, rn); int i = ready[m];
		used[i] = 1; out[i].startTime = t; t += procs[i].burst; out[i].completionTime = t;
		out[i].turnaroundTime = out[i].completionTime - procs[i].arrival;
		out[i].waitingTime = out[i].turnaroundTime - procs[i].burst;
		g[gi].id = procs[i].id; g[gi].start = out[i].startTime; g[gi].end = t; gi++;
		done++;
	}
	return gi;
}

static int prio(const ProcIn* procs, int count, GanttItem* g, ProcOut* out) {
	int done = 0, t = 0, gi = 0;
	int used[1024]; memset(used, 0, sizeof(used));
	while (done < count) {
		int ready[1024]; int rn = 0;
		for (int i = 0; i < count; ++i) if (!used[i] && procs[i].arrival <= t) ready[rn++] = i;
		if (rn == 0) {
			int next = 1e9; for (int i = 0; i < count; ++i) if (!used[i] && procs[i].arrival < next) next = procs[i].arrival;
			t = next; continue;
		}
		int m = min_index_by_priority(procs, ready, rn); int i = ready[m];
		used[i] = 1; out[i].startTime = t; t += procs[i].burst; out[i].completionTime = t;
		out[i].turnaroundTime = out[i].completionTime - procs[i].arrival;
		out[i].waitingTime = out[i].turnaroundTime - procs[i].burst;
		g[gi].id = procs[i].id; g[gi].start = out[i].startTime; g[gi].end = t; gi++;
		done++;
	}
	return gi;
}

static int rr(const ProcIn* procs, int count, int tq, GanttItem* g, ProcOut* out) {
	int rem[1024]; int started[1024];
	for (int i = 0; i < count; ++i) { rem[i] = procs[i].burst; started[i] = 0; }
	int t = 0, gi = 0, done = 0;
	int q[1024], qs = 0, qe = 0;
	int next_arrival = 0;
	while (done < count) {
		while (next_arrival < count && procs[next_arrival].arrival <= t) q[qe++] = next_arrival++;
		if (qs == qe) { t = procs[next_arrival].arrival; continue; }
		int i = q[qs++];
		int slice = rem[i] < tq ? rem[i] : tq;
		if (!started[i]) { out[i].startTime = t; started[i] = 1; }
		int s = t; t += slice; rem[i] -= slice;
		g[gi].id = procs[i].id; g[gi].start = s; g[gi].end = t; gi++;
		while (next_arrival < count && procs[next_arrival].arrival <= t) q[qe++] = next_arrival++;
		if (rem[i] > 0) q[qe++] = i; else { out[i].completionTime = t; out[i].turnaroundTime = t - procs[i].arrival; out[i].waitingTime = out[i].turnaroundTime - procs[i].burst; done++; }
	}
	return gi;
}

DLL_EXPORT int schedule(const ProcIn* processes, int count, const char* algorithm, int timeQuantum, GanttItem* gantt_out, int gantt_capacity, ProcOut* proc_out) {
	if (!processes || !gantt_out || !proc_out || count <= 0) return -1;
	// assume input sorted by arrival for fcfs and rr queueing simplicity
	int gi = 0;
	if (strcmp(algorithm, "FCFS") == 0) gi = fcfs(processes, count, gantt_out, proc_out);
	else if (strcmp(algorithm, "SJF") == 0) gi = sjf(processes, count, gantt_out, proc_out);
	else if (strcmp(algorithm, "Priority") == 0) gi = prio(processes, count, gantt_out, proc_out);
	else if (strcmp(algorithm, "RoundRobin") == 0) gi = rr(processes, count, timeQuantum > 0 ? timeQuantum : 1, gantt_out, proc_out);
	else return -1;
	return gi;
}
