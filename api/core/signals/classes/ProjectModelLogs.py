import datetime


class ProjectModelInsertionLog:
    def __init__(self, name, is_active,
                 project_id, project_name,
                 customer_rfc):
        self.name = name
        self.is_active = is_active
        self.project_id = project_id
        self.project_name = project_name
        self.customer_rfc = customer_rfc

    def get_json(self):
        return {
            'name': self.name,
            'is_active': self.is_active,
            'project_id': self.project_id,
            'project_name': self.project_name,
            'customer_rfc': self.customer_rfc,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }


class ProjectModelUpdateLog:
    def __init__(self):
        self.previous_name = ''
        self.previous_is_active = None
        self.updated_name = ''
        self.updated_is_active = None

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_is_active = previous_data['is_active']

    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_is_active = updated_data['is_active']

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_is_active': self.previous_is_active,
            'updated_name': self.updated_name,
            'updated_is_active': self.updated_is_active,
            'updated_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
