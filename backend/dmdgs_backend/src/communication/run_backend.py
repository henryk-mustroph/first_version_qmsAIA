from fastapi import FastAPI
from database_connector.db_connector import connect_to_db, close_db
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from routes.user_routes import router as user_router
from routes.language_model_routes import router as llm_router
from routes.domain_routes import router as domain_router
from routes.type_routes import router as type_router
from routes.training_data_routes import router as td_router
from routes.training_data_check_routes import router as tdc_router

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
    close_db
    ("MongoDB closed!")


# Register the event handlers with the app
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)

# Include all the routers with the correct prefix
app.include_router(user_router, prefix="/users")
app.include_router(llm_router, prefix="/language_models")
app.include_router(domain_router, prefix="/domains")
app.include_router(type_router, prefix="/types")
app.include_router(td_router, prefix="/training_data")
app.include_router(tdc_router, prefix="/training_data_checks")


# Main root
@app.get("/")
async def root():
    return {"message": "Application started"}


# Start localhost
if __name__ == "__main__":
    uvicorn.run("run_backend:app", host="0.0.0.0", port=5002)
