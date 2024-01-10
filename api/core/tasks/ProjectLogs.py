from celery import shared_task
import pymongo


@shared_task
def project_insertion_log(project):
    """Register the project registration in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['projectInsertionLogs']
        collection.insert_one(project)
        print('Project inserted')
        print(project)
        client.close()
    except Exception as e:
        return False

    return True


@shared_task
def project_update_log(updated_project):
    """Register the project update in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['projectUpdateLogs']
        collection.insert_one(updated_project)
        client.close()
    except Exception as e:
        return False

    return True
