from celery import shared_task
import os
import pymongo


@shared_task
def user_insertion_log(user):
    """Register the user registration in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['userInsertionLogs']
        collection.insert_one(user)
        client.close()
    except Exception as e:
        return False

    return True

@shared_task
def user_update_log(updated_user):
    """Register the user update in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['userUpdateLogs']
        collection.insert_one(updated_user)
        client.close()
    except Exception as e:
        return False

    return True

