import os
from pymongo.mongo_client import MongoClient
from fastapi import FastAPI
from dotenv import load_dotenv

from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()
app = FastAPI()


async def connect_to_db():
    # Credentials:
    atlas_uri = os.getenv("ATLAS_URI")
    db_name = os.getenv("DB_NAME")
    # URI to connect the right database:
    uri = atlas_uri
    # Create a new client and connect to the server
    client = AsyncIOMotorClient(uri)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        db = client.get_database(db_name)
        return db
    except Exception as e:
        print(e)


async def close_db():
    # Credentials:
    atlas_uri = os.getenv("ATLAS_URI")
    # URI to connect the right database:
    uri = atlas_uri
    client = MongoClient(uri)
    client.close()
