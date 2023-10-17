import datetime


class DataTypeInsertionLog:
    def __init__(self, name, description,
                 input_type):
        self.name = name
        self.description = description
        self.input_type = input_type

    def get_json(self):
        return {
            'name': self.name,
            'description': self.description,
            'input_type': self.input_type,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }


class DataTypeUpdateLog:
    def __init__(self):
        self.previous_name = ''
        self.previous_description = ''
        self.previous_input_type = ''
        self.previous_is_active = None
        self.updated_name = ''
        self.updated_description = ''
        self.updated_input_type = ''
        self.updated_is_active = None
        self.updated_date = ''

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_description = previous_data['description']
        self.previous_input_type = previous_data['input_type']
        self.previous_is_active = previous_data['is_active']

    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_description = updated_data['description']
        self.updated_input_type = updated_data['input_type']
        self.updated_is_active = updated_data['is_active']
        self.updated_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_description': self.previous_description,
            'previous_input_type': self.previous_input_type,
            'previous_is_active': self.previous_is_active,
            'updated_name': self.updated_name,
            'updated_description': self.updated_description,
            'updated_input_type': self.updated_input_type,
            'updated_is_active': self.updated_is_active,
            'updated_date': self.updated_date
        }
