from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pymongo

# Create your views here.

# Get customer create logs from mongodb
class GetCustomerCreateLogsView(APIView):
    """Get client create logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['customerInsertionLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date", -1).limit(10)
            logs = list(logs)
            print(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get customer update logs from mongodb
class GetCustomerUpdateLogsView(APIView):
    """Get client update logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['customerUpdateLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date",-1).limit(10)
            logs = list(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Get user create logs from mongodb
class GetUserCreateLogsView(APIView):
    """Get user create logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['userInsertionLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date",-1).limit(10)
            logs = list(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get user update logs from mongodb
class GetUserUpdateLogsView(APIView):
    """Get user update logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['userUpdateLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date",-1).limit(10)
            logs = list(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get project create logs from mongodb
class GetProjectCreateLogsView(APIView):
    """Get project create logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['projectInsertionLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date",-1).limit(10)
            logs = list(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Get project update logs from mongodb
class GetProjectUpdateLogsView(APIView):
    """Get project update logs from mongodb"""
    def get(self, request):
        try:
            MONGO_URI = f'mongodb://mongodb:27017'
            client = pymongo.MongoClient(MONGO_URI)
            db = client['sistemaOmetLogs']
            collection = db['projectUpdateLogs']
            logs = collection.find({}, {"_id": False}).sort("updated_date",-1).limit(10)
            logs = list(logs)
            client.close()
            return Response(logs, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
