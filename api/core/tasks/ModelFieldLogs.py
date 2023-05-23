from celery import shared_task
import pymongo


@shared_task
def model_field_insertion_log(model_field):
    """Insert the model field logs in the database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['modelFieldInsertionLogs']
        collection.insert_one(model_field)
        collection.close()
    except Exception as e:
        pass


@shared_task
def model_field_update_log(updated_model_field):
    """Insert the updated model field logs in the database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['modelFieldUpdateLogs']
        collection.insert_one(updated_model_field)
        collection.close()
    except Exception as e:
        pass
