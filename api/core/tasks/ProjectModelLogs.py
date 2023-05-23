from celery import shared_task
import pymongo


@shared_task
def project_model_insertion_log(project_model):
    """Register the project model registration in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['projectModelInsertionLogs']
        collection.insert_one(project_model)
        client.close()
    except Exception as e:
        return False

    return True


@shared_task
def project_model_update_log(updated_project_model):
    """Register the project model update in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['projectModelUpdateLogs']
        collection.insert_one(updated_project_model)
        client.close()
    except Exception as e:
        return False

    return True
