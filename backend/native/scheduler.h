#ifndef SCHEDULER_H
#define SCHEDULER_H

#ifdef _WIN32
#define DLL_EXPORT __declspec(dllexport)
#else
#define DLL_EXPORT
#endif

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
	int id;
	int arrival;
	int burst;
	int priority;
} ProcIn;

typedef struct {
	int id;
	int start;
	int end;
} GanttItem;

typedef struct {
	int startTime;
	int completionTime;
	int waitingTime;
	int turnaroundTime;
} ProcOut;

// Returns number of gantt items written, or -1 on error
DLL_EXPORT int schedule(const ProcIn* processes,
	int count,
	const char* algorithm, // "FCFS" | "SJF" | "Priority" | "RoundRobin"
	int timeQuantum,
	GanttItem* gantt_out,
	int gantt_capacity,
	ProcOut* proc_out // length == count
);

#ifdef __cplusplus
}
#endif

#endif // SCHEDULER_H
