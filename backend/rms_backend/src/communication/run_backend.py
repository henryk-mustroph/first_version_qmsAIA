#
# This file is part of first_version_qmsAIA.
#
# first_version_qmsAIA is free software: you can redistribute it and/or modify it
# under the terms of the GNU Lesser General Public License as published by the
# Free Software Foundation, either version 3 of the License, or (at your
# option) any later version.
#
# social_network_miner_compliance_check is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more
# details.
#
# You should have received a copy of the GNU Lesser General Public License
# along with first_version_qmsAIA (file COPYING in the main directory). If not, see
# http://www.gnu.org/licenses/.

from fastapi import FastAPI
from database_connector.db_connector import connect_to_db, close_db
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from routes.user_routes import router as user_router
from routes.data_routes import router as data_router
from routes.language_model_routes import router as language_model_router
from routes.metric_routes import router as metric_router

from routes.risk_identification_routes import router as risk_identification_router
from routes.risk_analysis_routes import router as risk_analysis_router
from routes.risk_assessment_routes import router as risk_assessment_router

from routes.domain_routes import router as domain_router
from routes.capability_routes import router as capability_router
from routes.purpose_routes import router as purpose_router
from routes.llm_user_routes import router as llm_user_router
from routes.llm_subject_routes import router as llm_subject_router

app = FastAPI(debug=True)

origins = [
    ""
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
    await connect_to_db()
    print("Connected to MongoDB")
    print("Started Backend!")


# End App
async def shutdown_event():
    await close_db()
    print("MongoDB closed!")


# Register the event handlers with the app
app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)

# Include all the routers with the correct prefix
app.include_router(user_router, prefix="/users")
app.include_router(data_router, prefix="/data")
app.include_router(language_model_router, prefix="/language_models")
app.include_router(metric_router, prefix="/metrics")

app.include_router(risk_identification_router, prefix="/risk_identifications")
app.include_router(risk_analysis_router, prefix="/risk_analyses")
app.include_router(risk_assessment_router, prefix="/risk_assessments")

app.include_router(domain_router, prefix="/domains")
app.include_router(capability_router, prefix="/capabilities")
app.include_router(purpose_router, prefix="/purposes")
app.include_router(llm_user_router, prefix="/llm_users")
app.include_router(llm_subject_router, prefix="/llm_subjects")


# Main root
@app.get("/")
async def root():
    return {"message": "Application started"}


# Start localhost
if __name__ == "__main__":
    uvicorn.run("run_backend:app", host="0.0.0.0", port=5001, log_level="debug")
