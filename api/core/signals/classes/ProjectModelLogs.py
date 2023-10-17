import datetime


class ProjectModelInsertionLog:
    def __init__(self, name, project_id, project_name,
                 customer_rfc):
        self.name = name
        self.project_id = project_id
        self.project_name = project_name
        self.customer_rfc = customer_rfc

    def get_json(self):
        return {
            'name_registered': self.name,
            'project_id_registered': self.project_id,
            'project_name_registered': self.project_name,
            'customer_rfc_registered': self.customer_rfc,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }


class ProjectModelUpdateLog:
    def __init__(self):
        self.previous_name = ''
        self.previous_project_id = 0
        self.previous_project_name = ''
        self.previous_customer_rfc = ''
        self.previous_is_active = None
        self.updated_name = ''
        self.updated_project_id = 0
        self.updated_project_name = ''
        self.updated_customer_rfc = ''

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_project_id = previous_data['project'].id
        self.previous_project_name = previous_data['project'].name
        self.previous_customer_rfc = previous_data['project'].customer.rfc

    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_project_id = updated_data['project'].id
        self.updated_project_name = updated_data['project'].name
        self.updated_customer_rfc = updated_data['project'].customer.rfc

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_project_id': self.previous_project_id,
            'previous_project_name': self.previous_project_name,
            'previous_customer_rfc': self.previous_customer_rfc,
            'previous_is_active': self.previous_is_active,
            'updated_name': self.updated_name,
            'updated_project_id': self.updated_project_id,
            'updated_project_name': self.updated_project_name,
            'updated_customer_rfc': self.updated_customer_rfc,
            'updated_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
