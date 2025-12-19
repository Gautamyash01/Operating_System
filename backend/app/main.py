from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.simulation import router as simulation_router
from .routers.processes import router as processes_router

app = FastAPI(title="Process & Memory Management Simulator API")

# Allow local dev origins
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# Mount routers under /api to match frontend
app.include_router(simulation_router, prefix="/api", tags=["simulation"])
app.include_router(processes_router, prefix="/api", tags=["processes"])


@app.get("/api/health")
async def health() -> dict:
	return {"status": "ok"}
