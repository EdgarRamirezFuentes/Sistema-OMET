from celery import shared_task
import pymongo


@shared_task
def customer_insertion_log(customer):
    """Register the customer registration in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['customerInsertionLogs']
        collection.insert_one(customer)
        client.close()
    except Exception as e:
        return False

    return True

@shared_task
def customer_update_log(updated_customer):
    """Register the customer update in the logs database"""
    try:
        MONGO_URI = f'mongodb://mongodb:27017'
        client = pymongo.MongoClient(MONGO_URI)
        db = client['sistemaOmetLogs']
        collection = db['customerUpdateLogs']
        collection.insert_one(updated_customer)
        client.close()
    except Exception as e:
        return False

    return True

