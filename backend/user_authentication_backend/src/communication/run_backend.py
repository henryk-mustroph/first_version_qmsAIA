from fastapi import FastAPI
from database_connector.db_connector import connect_to_db, close_db
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from routes.user_routes import router as user_router

app = FastAPI()

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


# Start App
async def startup_event():
    # Connect to the database when the application starts
    connect_to_db()
    print("Connected to MongoDB")
    print("Started Backend!")


# End App
async def shutdown_event():
    close_db()
    print("MongoDB closed!")


# Register the event handlers with the app
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)

# Include all the routers with the correct prefix
app.include_router(user_router, prefix="/users")


# Main root
@app.get("/")
async def root():
    return {"message": "Application started"}


# Start localhost
if __name__ == "__main__":
    uvicorn.run("run_backend:app", host="0.0.0.0", port=5003)
