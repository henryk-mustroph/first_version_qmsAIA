from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from distributor import router as gateway_router

# Define the FastAPI app
app = FastAPI(debug=True)

origins = [
    "http://localhost:3000",
    "https://power.bpm.cit.tum.de/qmsAIA/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the startup and shutdown events
def startup_event():
    print("Started Backend!")


def shutdown_event():
    print("Shutting down Backend!")


# Register the event handlers with the app
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)

# Include the gateway router from distributor.py
app.include_router(gateway_router)


# Main root
@app.get("/")
async def root():
    return {"message": "Application started"}


# Start localhost
if __name__ == "__main__":
    uvicorn.run("run_backend:app", host="0.0.0.0", port=4999, log_level="debug")
