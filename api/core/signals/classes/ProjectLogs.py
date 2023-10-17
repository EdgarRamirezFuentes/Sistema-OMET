import datetime


class ProjectInsertionLog:
    def __init__(self, name, description, customer_rfc):
        self.name = name
        self.description = description
        self.customer_rfc = customer_rfc

    def get_json(self):
        return {
            'name_registered': self.name,
            'description_registered': self.description,
            'customer_rfc_registered': self.customer_rfc,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }


class ProjectUpdateLog:
    def __init__(self):
        self.previous_name = ''
        self.previous_description = ''
        self.previous_customer_rfc = ''
        self.updated_name = ''
        self.updated_description = ''
        self.updated_customer_rfc = ''
        self.updated_date = ''

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_description = previous_data['description']
        self.previous_customer_rfc = previous_data['customer'].rfc


    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_description = updated_data['description']
        self.updated_customer_rfc = updated_data['customer'].rfc
        self.updated_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_description': self.previous_description,
            'previous_customer_rfc': self.previous_customer_rfc,
            'updated_name': self.updated_name,
            'updated_description': self.updated_description,
            'updated_customer_rfc': self.updated_customer_rfc,
            'updated_date': self.updated_date
        }

