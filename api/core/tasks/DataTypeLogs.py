from celery import shared_task
import pymongo


@shared_task
def data_type_insertion_log(data_type):
    """Insert the data type logs in the database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['dataTypeInsertionLogs']
        collection.insert_one(data_type)
        collection.close()
    except Exception as e:
        pass


@shared_task
def data_type_update_log(updated_data_type):
    """Insert the updated data type logs in the database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['dataTypeUpdateLogs']
        collection.insert_one(updated_data_type)
        collection.close()
    except Exception as e:
        pass
