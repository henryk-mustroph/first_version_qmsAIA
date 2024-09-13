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

import os
from pymongo.mongo_client import MongoClient
from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()


def connect_to_db():
    # Credentials:
    atlas_uri = os.getenv("ATLAS_URI")
    db_name = os.getenv("DB_NAME")
    # URI to connect the right database:
    uri = atlas_uri
    # Create a new client and connect to the server
    client = MongoClient(uri)
    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
        db = client[db_name]
        return db
    except Exception as e:
        print(e)
     
        
def close_db():
    # Credentials:
    atlas_uri = os.getenv("ATLAS_URI")
    # URI to connect the right database:
    uri = atlas_uri
    client = MongoClient(uri)
    client.close()
